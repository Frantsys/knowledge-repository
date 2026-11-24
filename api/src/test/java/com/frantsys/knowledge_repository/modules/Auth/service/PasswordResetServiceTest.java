package com.frantsys.knowledge_repository.modules.Auth.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasswordResetServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ObjectProvider<JavaMailSender> mailSenderProvider;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private PasswordResetService service;

    private User activeUser() {
        User user = new User();
        user.setEmail("ana@banca.local");
        user.setIsActive(true);
        return user;
    }

    @Test
    void requestResetSavesOnlyTheHashWithExpiry() {
        User user = activeUser();
        when(userRepository.findByEmail("ana@banca.local")).thenReturn(Optional.of(user));

        service.requestReset("ana@banca.local");

        assertThat(user.getResetTokenHash()).hasSize(64);
        assertThat(user.getResetTokenExpiresAt()).isAfter(LocalDateTime.now());
        verify(userRepository).save(user);
    }

    @Test
    void requestResetEmailsTheLinkWhenSmtpIsConfigured() {
        User user = activeUser();
        user.setFirstName("Ana");
        when(userRepository.findByEmail("ana@banca.local")).thenReturn(Optional.of(user));
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        ReflectionTestUtils.setField(service, "mailHost", "smtp.exemplo.com");
        ReflectionTestUtils.setField(service, "frontendUrl", "https://banca.app");

        service.requestReset("ana@banca.local");

        // O envio é em segundo plano
        ArgumentCaptor<SimpleMailMessage> sent = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, timeout(2000)).send(sent.capture());
        assertThat(sent.getValue().getTo()).containsExactly("ana@banca.local");
        assertThat(sent.getValue().getText()).contains("https://banca.app/redefinir-senha?token=");
    }

    @Test
    void requestResetWithoutSmtpDoesNotSend() {
        when(userRepository.findByEmail("ana@banca.local")).thenReturn(Optional.of(activeUser()));
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        ReflectionTestUtils.setField(service, "mailHost", "");

        service.requestReset("ana@banca.local");

        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void requestResetForUnknownEmailDoesNothing() {
        when(userRepository.findByEmail("x@y.com")).thenReturn(Optional.empty());

        service.requestReset("x@y.com");

        verify(userRepository, never()).save(any());
    }

    @Test
    void resetPasswordWithValidTokenChangesPasswordAndClearsToken() {
        User user = activeUser();
        user.setResetTokenHash(PasswordResetService.hash("token-valido"));
        user.setResetTokenExpiresAt(LocalDateTime.now().plusMinutes(10));
        when(userRepository.findByResetTokenHash(PasswordResetService.hash("token-valido"))).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("novaSenha123")).thenReturn("encoded");

        service.resetPassword("token-valido", "novaSenha123");

        assertThat(user.getPassword()).isEqualTo("encoded");
        assertThat(user.getResetTokenHash()).isNull();
        assertThat(user.getResetTokenExpiresAt()).isNull();
    }

    @Test
    void resetPasswordWithExpiredTokenFails() {
        User user = activeUser();
        user.setResetTokenExpiresAt(LocalDateTime.now().minusMinutes(1));
        when(userRepository.findByResetTokenHash(any())).thenReturn(Optional.of(user));

        assertThrows(BusinessException.class, () -> service.resetPassword("token-velho", "novaSenha123"));
        verify(userRepository, never()).save(any());
    }

}
