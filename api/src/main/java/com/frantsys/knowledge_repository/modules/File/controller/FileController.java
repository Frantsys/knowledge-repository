package com.frantsys.knowledge_repository.modules.File.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frantsys.knowledge_repository.modules.File.dto.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.FileUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.File.dto.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.service.FileService;

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




@Tag(name = "File", description = "API path for managing files")
@RestController 
@RequestMapping("v1/api/files")
@RequiredArgsConstructor  
public class FileController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<FileResponse>> findAll() {
        
        List<FileResponse> files = fileService.findAll();

        return ResponseEntity.ok(files);

    }

    @PostMapping
    public ResponseEntity<FileResponse> create(@RequestBody @Valid FileCreateRequest request) {
        
        FileResponse file = fileService.createFile(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(file);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<FileResponse> update(@PathVariable Long id, @RequestBody @Valid FileUpdateRequest request) {

        FileResponse file = fileService.updateById(id, request);

        return ResponseEntity.ok(file);

    }
    

    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> findById(@PathVariable Long id) {
        
        FileResponse file = fileService.findById(id);

        return ResponseEntity.status(HttpStatus.FOUND).body(file);

    }
    
    @PatchMapping("/{id}/activation")
    public ResponseEntity<FileResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid FileUpdateActivationRequest request) {
        
        FileResponse file = fileService.updateActivationById(id, request);

        return ResponseEntity.ok(file);

    }
    
    
}
