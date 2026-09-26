package com.frantsys.knowledge_repository.modules.Auth.service;

import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class TokenServiceTest {

    private TokenService tokenService;
    private User user;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(tokenService, "secret", "test-only-secret-key-with-at-least-32-chars");
        ReflectionTestUtils.setField(tokenService, "hours", 1L);

        user = new User();
        user.setEmail("student@example.com");
        user.setRole(UserRole.ROLE_STUDENT);
    }

    @Test
    @DisplayName("generateToken should create a token that encodes the username and stays valid")
    void generateToken_shouldCreateValidTokenForUser() {
        String token = tokenService.generateToken(user);

        assertThat(token).isNotBlank();
        assertThat(tokenService.extractUsername(token)).isEqualTo("student@example.com");
        assertThat(tokenService.isTokenValid(token)).isTrue();
    }

    @Test
    @DisplayName("isTokenValid should return false for a malformed token")
    void isTokenValid_shouldReturnFalseForMalformedToken() {
        assertThat(tokenService.isTokenValid("this-is-not-a-jwt")).isFalse();
    }

    @Test
    @DisplayName("isTokenValid should return false for an already expired token")
    void isTokenValid_shouldReturnFalseForExpiredToken() {
        ReflectionTestUtils.setField(tokenService, "hours", -1L);

        String expiredToken = tokenService.generateToken(user);

        assertThat(tokenService.isTokenValid(expiredToken)).isFalse();
    }

}