package com.frantsys.knowledge_repository.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// Limita tentativas nos endpoints públicos de autenticação (adivinhar senha, disparar e-mails, criar contas em massa).
// Janela fixa por IP e endpoint.
// shortcut: contagem em memória e pelo IP da conexão; com mais de uma instância ou atrás de proxy, trocar por Redis/Bucket4j
// e ler o IP real do X-Forwarded-For confiável
public class AuthRateLimitFilter extends OncePerRequestFilter {

    record Rule(int maxRequests, Duration window) {
    }

    private record Window(long startMillis, int count) {
    }

    static final Map<String, Rule> RULES = Map.of(
            "/v1/api/auth/login", new Rule(10, Duration.ofMinutes(1)),
            "/v1/api/auth/register", new Rule(5, Duration.ofMinutes(10)),
            "/v1/api/auth/forgot-password", new Rule(5, Duration.ofMinutes(15)),
            "/v1/api/auth/reset-password", new Rule(10, Duration.ofMinutes(15))
    );

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !RULES.containsKey(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        long retryAfterSeconds = tryAcquire(path + "|" + request.getRemoteAddr(), RULES.get(path), System.currentTimeMillis());

        if (retryAfterSeconds > 0) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("""
                    {"title":"Muitas tentativas","status":429,"detail":"Muitas tentativas seguidas. Aguarde %s e tente de novo."}"""
                    .formatted(retryAfterSeconds >= 60 ? (retryAfterSeconds + 59) / 60 + " min" : retryAfterSeconds + " s"));
            return;
        }

        chain.doFilter(request, response);
    }

    // Devolve 0 se a requisição pode seguir, ou quantos segundos faltam para a janela reabrir
    long tryAcquire(String key, Rule rule, long nowMillis) {
        long windowMillis = rule.window().toMillis();

        // Evita crescer sem limite: de vez em quando descarta janelas vencidas
        if (windows.size() > 10_000) {
            windows.values().removeIf(window -> nowMillis - window.startMillis() >= windowMillis);
        }

        Window window = windows.compute(key, (k, current) ->
                current == null || nowMillis - current.startMillis() >= windowMillis
                        ? new Window(nowMillis, 1)
                        : new Window(current.startMillis(), current.count() + 1));

        if (window.count() <= rule.maxRequests()) {
            return 0;
        }
        return Math.max(1, (window.startMillis() + windowMillis - nowMillis + 999) / 1000);
    }

}
