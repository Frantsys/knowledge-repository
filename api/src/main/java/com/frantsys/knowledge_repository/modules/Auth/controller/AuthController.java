package com.frantsys.knowledge_repository.modules.Auth.controller;

import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserLoginRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserRegisterRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.response.UserLoginResponse;
import com.frantsys.knowledge_repository.modules.Auth.service.AuthService;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User Auth", description = "API path for managing user authentication")
@RestController
@RequestMapping("/v1/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody @Valid UserRegisterRequest request) {

        UserResponse user = authService.userRegister(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(user);

    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody @Valid UserLoginRequest request) {

        UserLoginResponse response = authService.userLogin(request);

        return ResponseEntity.status(HttpStatus.OK).body(response);

    }


}
