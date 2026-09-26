package com.frantsys.knowledge_repository.modules.Auth.service;

import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserLoginRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserRegisterRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.response.UserLoginResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService authService;

    private UserRegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new UserRegisterRequest();
        registerRequest.setEmail("student@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("Anna");
        registerRequest.setLastName("Smith");

        user = new User();
        user.setEmail("student@example.com");
        user.setPassword("password123");
    }

    @Test
    @DisplayName("userRegister should encrypt the password, activate and save the user")
    void userRegister_shouldCreateUserSuccessfully() {
        when(userMapper.toEntity(registerRequest)).thenReturn(user);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(new UserResponse());

        UserResponse response = authService.userRegister(registerRequest);

        assertThat(response).isNotNull();
        assertEquals("encoded-password", user.getPassword());
        assertEquals(UserRole.ROLE_STUDENT, user.getRole());
        assertThat(user.getIsActive()).isTrue();

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("userLogin should authenticate and return a valid Bearer token")
    void userLogin_shouldAuthenticateAndReturnToken() {
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail("student@example.com");
        loginRequest.setPassword("password123");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, loginRequest.getPassword());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenService.generateToken(user)).thenReturn("fake-jwt-token");

        UserLoginResponse response = authService.userLogin(loginRequest);

        assertThat(response.getTokenType()).isEqualTo("Bearer");
        assertThat(response.getToken()).isEqualTo("fake-jwt-token");
        verify(tokenService).generateToken(user);
    }

    @Test
    @DisplayName("userLogin should propagate the exception when credentials are invalid")
    void userLogin_shouldThrowExceptionWhenCredentialsAreInvalid() {
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail("student@example.com");
        loginRequest.setPassword("wrong-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.userLogin(loginRequest));
    }

}