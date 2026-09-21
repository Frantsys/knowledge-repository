package com.frantsys.knowledge_repository.modules.Material.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frantsys.knowledge_repository.modules.Material.dto.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.service.MaterialService;

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
import org.springframework.web.bind.annotation.RequestBody;


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

    @GetMapping("/{id}")
    public ResponseEntity<MaterialResponse> findById(@PathVariable Long id) {
        
        MaterialResponse material = materialService.findById(id);

        return ResponseEntity.status(HttpStatus.FOUND).body(material);

    }
    
    @PostMapping
    public ResponseEntity<MaterialResponse> create(@RequestBody @Valid MaterialCreateRequest request) {
        
        MaterialResponse material = materialService.createMaterial(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(material);

    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<MaterialResponse> updateById(@PathVariable Long id, @RequestBody @Valid MaterialUpdateRequest request) {

        MaterialResponse material = materialService.updateById(id, request);

        return ResponseEntity.status(HttpStatus.OK).body(material);

    }
    

}
