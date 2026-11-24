package com.frantsys.knowledge_repository.modules.Auth.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetService {

    static final Duration TOKEN_TTL = Duration.ofMinutes(30);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    // Sempre responde igual, exista ou não o e-mail (não revela quem tem conta)
    @Transactional
    public void requestReset(String email) {
        userRepository.findByEmail(email).filter(User::getIsActive).ifPresent(user -> {
            byte[] bytes = new byte[32];
            RANDOM.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            user.setResetTokenHash(hash(token));
            user.setResetTokenExpiresAt(LocalDateTime.now().plus(TOKEN_TTL));
            userRepository.save(user);

            // shortcut: sem servidor de e-mail, o link vai só para o log; adicionar spring-boot-starter-mail antes de produção
            log.info("Link de redefinição de senha para {}: {}/redefinir-senha?token={}", email, frontendUrl, token);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetTokenHash(hash(token))
                .filter(found -> found.getResetTokenExpiresAt() != null && found.getResetTokenExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new BusinessException("Este link de redefinição é inválido ou expirou. Peça um novo."));

        user.setPassword(passwordEncoder.encode(newPassword));
        // Token de uso único
        user.setResetTokenHash(null);
        user.setResetTokenExpiresAt(null);
        userRepository.save(user);
    }

    static String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

}
