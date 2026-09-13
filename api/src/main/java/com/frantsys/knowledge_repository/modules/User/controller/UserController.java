package com.frantsys.knowledge_repository.modules.User.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frantsys.knowledge_repository.modules.User.dto.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.service.UserService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@Tag(name = "User", description = "API path for managing users")
@RestController 
@RequestMapping("/v1/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService service;

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> findAll() {

        List<UserSummaryResponse> users = service.findAll();
        return ResponseEntity.ok(users);

    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        UserResponse user = service.findById(id);

        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody @Valid UserCreateRequest request) {
        
        UserResponse user = service.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(user);

    }

    @PatchMapping("/{id}/activation")
    public ResponseEntity<UserResponse> updateStatus(@PathVariable Long id, @RequestBody @Valid UserUpdateActivationRequest request) {
        UserResponse updatedUser = service.updateActivationById(id, request);

        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<UserResponse> changePasswordById(@PathVariable Long id, @RequestBody @Valid UserUpdatePasswordRequest request) {
        service.updatePassword(id, request);

        return ResponseEntity.noContent().build();
    }

    
    

}
