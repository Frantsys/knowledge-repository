package com.frantsys.knowledge_repository.modules.User.controller;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserFilterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "User", description = "API path for managing users")
@RestController
@RequestMapping("/v1/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> findAll() {

        List<UserResponse> users = userService.findAll();

        return ResponseEntity.ok(users);

    }

    @GetMapping("/summary")
    public ResponseEntity<List<UserSummaryResponse>> findAllSummary() {

        List<UserSummaryResponse> users = userService.findAllSummary();

        return ResponseEntity.ok(users);

    }

    @GetMapping("/filter")
    public ResponseEntity<List<UserResponse>> filter(@ModelAttribute UserFilterRequest filter) {

        List<UserResponse> users = userService.filter(filter);

        return ResponseEntity.ok(users);

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {

        UserResponse user = userService.findById(id);

        return ResponseEntity.ok(user);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {

        UserResponse user = userService.updateById(id, request);

        return ResponseEntity.ok(user);

    }

    @PatchMapping("/{id}/activation")
    public ResponseEntity<UserResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid UserUpdateActivationRequest request) {

        UserResponse user = userService.updateActivationById(id, request);

        return ResponseEntity.ok(user);

    }

    // Altera a senha do usuário autenticado (o e-mail vem do subject do JWT)
    @PatchMapping("/password")
    public ResponseEntity<Void> updatePassword(Authentication authentication, @RequestBody @Valid UserUpdatePasswordRequest request) {

        userService.updatePassword(authentication.getName(), request);

        return ResponseEntity.noContent().build();

    }

}
