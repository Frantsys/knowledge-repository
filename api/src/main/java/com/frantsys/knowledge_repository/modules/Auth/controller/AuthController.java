package com.frantsys.knowledge_repository.modules.Auth.controller;

import com.frantsys.knowledge_repository.modules.Auth.dto.request.ForgotPasswordRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.ResetPasswordRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserLoginRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserRegisterRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.response.UserLoginResponse;
import com.frantsys.knowledge_repository.modules.Auth.service.AuthService;
import com.frantsys.knowledge_repository.modules.Auth.service.PasswordResetService;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User Auth", description = "Caminho da API para gerenciar a autenticação do usuário")
@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @Operation(summary = "Cadastra um novo usuário")
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid UserRegisterRequest request) {

        UserResponse user = authService.userRegister(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(user);

    }

    @Operation(summary = "Autentica e devolve o token JWT")
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody @Valid UserLoginRequest request) {

        UserLoginResponse response = authService.userLogin(request);

        return ResponseEntity.ok(response);

    }

    @Operation(summary = "Envia o link de redefinição de senha (responde 202 mesmo se o e-mail não existir)")
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {

        passwordResetService.requestReset(request.getEmail());

        return ResponseEntity.accepted().build();

    }

    @Operation(summary = "Define uma nova senha a partir do token do link")
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {

        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

        return ResponseEntity.noContent().build();

    }


}
