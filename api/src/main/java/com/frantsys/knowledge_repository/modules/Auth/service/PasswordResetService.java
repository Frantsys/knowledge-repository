package com.frantsys.knowledge_repository.modules.Auth.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
    // Só existe com MAIL_HOST configurado; sem ele, o link vai para o log (desenvolvimento)
    private final ObjectProvider<JavaMailSender> mailSender;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${app.mail.from:Banca de Materiais <no-reply@banca.local>}")
    private String mailFrom;

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

            sendResetLink(user, frontendUrl + "/redefinir-senha?token=" + token);
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

    private void sendResetLink(User user, String link) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null || mailHost == null || mailHost.isBlank()) {
            log.info("E-mail não configurado (MAIL_HOST). Link de redefinição de senha para {}: {}", user.getEmail(), link);
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(user.getEmail());
        message.setSubject("Redefinir sua senha - Banca de Materiais");
        message.setText("""
                Olá, %s!

                Recebemos um pedido para redefinir a senha da sua conta na Banca de Materiais.
                Para criar uma senha nova, abra o link abaixo (ele vale por 30 minutos e só pode ser usado uma vez):

                %s

                Se não foi você, ignore este e-mail: sua senha continua a mesma.
                """.formatted(user.getFirstName(), link));

        // Em segundo plano: o SMTP leva segundos e a resposta não pode demorar mais quando o e-mail existe
        // (senão o tempo de resposta revelaria quem tem conta)
        Thread.startVirtualThread(() -> {
            try {
                sender.send(message);
            } catch (RuntimeException e) {
                log.error("Falha ao enviar o e-mail de redefinição de senha para {}", user.getEmail(), e);
            }
        });
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
