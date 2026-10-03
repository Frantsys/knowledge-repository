package com.frantsys.knowledge_repository.modules.Material.controller;

import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import com.frantsys.knowledge_repository.modules.Material.service.MaterialService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Material", description = "API path for managing materials")
@RestController
@RequestMapping("/v1/api/materials")
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    public ResponseEntity<List<MaterialResponse>> findAll() {

        List<MaterialResponse> materials = materialService.findAll();

        return ResponseEntity.ok(materials);

    }

    @GetMapping("/summary")
    public ResponseEntity<List<MaterialSummaryResponse>> findAllSummary() {

        List<MaterialSummaryResponse> materials = materialService.findAllSummary();

        return ResponseEntity.ok(materials);

    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> findById(@PathVariable Long id) {

        MaterialResponse material = materialService.findById(id);

        return ResponseEntity.ok(material);

    }

    @PostMapping
    public ResponseEntity<MaterialResponse> create(Authentication authentication, @RequestBody @Valid MaterialCreateRequest request) {

        MaterialResponse material = materialService.create(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(material);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<MaterialResponse> update(@PathVariable Long id, @RequestBody @Valid MaterialUpdateRequest request) {

        MaterialResponse material = materialService.updateById(id, request);

        return ResponseEntity.ok(material);

    }

    @PatchMapping("/{id}/activation")
    public ResponseEntity<MaterialResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid MaterialUpdateActivationRequest request) {

        MaterialResponse material = materialService.updateActivationById(id, request);

        return ResponseEntity.ok(material);

    }

}
