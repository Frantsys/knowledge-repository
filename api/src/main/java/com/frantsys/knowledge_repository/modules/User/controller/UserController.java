package com.frantsys.knowledge_repository.modules.User.controller;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserFilterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "User", description = "API path for managing users")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Lista usuários (paginado, somente admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Page<UserResponse>> findAll(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<UserResponse> users = userService.findAll(pageable);

        return ResponseEntity.ok(users);

    }

    @Operation(summary = "Lista resumo dos usuários (paginado, somente admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public ResponseEntity<Page<UserSummaryResponse>> findAllSummary(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<UserSummaryResponse> users = userService.findAllSummary(pageable);

        return ResponseEntity.ok(users);

    }

    @Operation(summary = "Filtra usuários (paginado, somente admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/filter")
    public ResponseEntity<Page<UserResponse>> filter(@ModelAttribute UserFilterRequest filter, @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<UserResponse> users = userService.filter(filter, pageable);

        return ResponseEntity.ok(users);

    }

    @Operation(summary = "Busca um usuário pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {

        UserResponse user = userService.findById(id);

        return ResponseEntity.ok(user);

    }

    @Operation(summary = "Atualiza um usuário (o próprio usuário ou admin)")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isSelf(#id, authentication.name)")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {

        UserResponse user = userService.updateById(id, request);

        return ResponseEntity.ok(user);

    }

    @Operation(summary = "Ativa ou desativa um usuário (somente admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/activation")
    public ResponseEntity<UserResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid UserUpdateActivationRequest request) {

        UserResponse user = userService.updateActivationById(id, request);

        return ResponseEntity.ok(user);

    }

    // Altera a senha do usuário autenticado
    @Operation(summary = "Altera a senha do usuário autenticado")
    @PatchMapping("/password")
    public ResponseEntity<Void> updatePassword(Authentication authentication, @RequestBody @Valid UserUpdatePasswordRequest request) {

        userService.updatePassword(authentication.getName(), request);

        return ResponseEntity.noContent().build();

    }

}
