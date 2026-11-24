package com.frantsys.knowledge_repository.modules.User.controller;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserFilterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.service.UserAvatarService;
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
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;

@Tag(name = "User", description = "Caminho da API para gerenciar usuários")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserAvatarService userAvatarService;

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

    @Operation(summary = "Busca o usuário autenticado")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> findMe(Authentication authentication) {

        return ResponseEntity.ok(userService.findByEmail(authentication.getName()));

    }

    // multipart/form-data com a parte "file": JPG, PNG ou WEBP até 5 MB
    @Operation(summary = "Envia ou troca a foto de perfil do usuário autenticado")
    @PutMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateAvatar(Authentication authentication, @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(userAvatarService.updateAvatar(authentication.getName(), file));

    }

    @Operation(summary = "Remove a foto de perfil do usuário autenticado")
    @DeleteMapping("/me/avatar")
    public ResponseEntity<UserResponse> removeAvatar(Authentication authentication) {

        return ResponseEntity.ok(userAvatarService.removeAvatar(authentication.getName()));

    }

    // Público (liberado no SecurityConfig) porque <img> não envia o token; a chave é um UUID que só a API entrega.
    // A chave muda a cada upload, então a resposta pode ficar em cache indefinidamente.
    @Operation(summary = "Exibe uma foto de perfil pela chave (público)")
    @GetMapping("/avatars/{key}")
    public ResponseEntity<Resource> avatar(@PathVariable String key) {

        UserAvatarService.Avatar avatar = userAvatarService.loadAvatar(key);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(avatar.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(avatar.resource());

    }

    @Operation(summary = "Busca um usuário pelo ID (o próprio usuário ou admin: a resposta tem CPF, endereço e contato)")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isSelf(#id, authentication.name)")
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
