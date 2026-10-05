package com.frantsys.knowledge_repository.modules.Material.controller;

import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import com.frantsys.knowledge_repository.modules.Material.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Material", description = "API path for managing materials")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @Operation(summary = "Lista materiais (paginado)")
    @GetMapping
    public ResponseEntity<Page<MaterialResponse>> findAll(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<MaterialResponse> materials = materialService.findAll(pageable);

        return ResponseEntity.ok(materials);

    }

    @Operation(summary = "Lista resumo dos materiais (paginado)")
    @GetMapping("/summary")
    public ResponseEntity<Page<MaterialSummaryResponse>> findAllSummary(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<MaterialSummaryResponse> materials = materialService.findAllSummary(pageable);

        return ResponseEntity.ok(materials);

    }

    @Operation(summary = "Busca um material pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> findById(@PathVariable Long id) {

        MaterialResponse material = materialService.findById(id);

        return ResponseEntity.ok(material);

    }

    @Operation(summary = "Cria um material")
    @PostMapping
    public ResponseEntity<MaterialResponse> create(Authentication authentication, @RequestBody @Valid MaterialCreateRequest request) {

        MaterialResponse material = materialService.create(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(material);

    }

    @Operation(summary = "Atualiza um material (dono, moderador ou admin)")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR') or @securityService.isMaterialOwner(#id, authentication.name)")
    @PatchMapping("/{id}")
    public ResponseEntity<MaterialResponse> update(@PathVariable Long id, @RequestBody @Valid MaterialUpdateRequest request) {

        MaterialResponse material = materialService.updateById(id, request);

        return ResponseEntity.ok(material);

    }

    @Operation(summary = "Ativa ou desativa um material (dono, moderador ou admin)")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR') or @securityService.isMaterialOwner(#id, authentication.name)")
    @PatchMapping("/{id}/activation")
    public ResponseEntity<MaterialResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid MaterialUpdateActivationRequest request) {

        MaterialResponse material = materialService.updateActivationById(id, request);

        return ResponseEntity.ok(material);

    }

}
