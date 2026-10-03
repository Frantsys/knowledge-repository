package com.frantsys.knowledge_repository.modules.File.controller;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import com.frantsys.knowledge_repository.modules.File.service.FileService;
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

@Tag(name = "File", description = "API path for managing files")
@RestController
@RequestMapping("/v1/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<List<FileResponse>> findAll() {

        List<FileResponse> files = fileService.findAll();

        return ResponseEntity.ok(files);

    }

    @GetMapping("/summary")
    public ResponseEntity<List<FileSummaryResponse>> findAllSummary() {

        List<FileSummaryResponse> files = fileService.findAllSummary();

        return ResponseEntity.ok(files);

    }

    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> findById(@PathVariable Long id) {

        FileResponse file = fileService.findById(id);

        return ResponseEntity.ok(file);

    }

    @PostMapping
    public ResponseEntity<FileResponse> create(Authentication authentication, @RequestBody @Valid FileCreateRequest request) {

        FileResponse file = fileService.create(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(file);

    }

    @PatchMapping("/{id}")
    public ResponseEntity<FileResponse> update(@PathVariable Long id, @RequestBody @Valid FileUpdateRequest request) {

        FileResponse file = fileService.updateById(id, request);

        return ResponseEntity.ok(file);

    }

    @PatchMapping("/{id}/activation")
    public ResponseEntity<FileResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid FileUpdateActivationRequest request) {

        FileResponse file = fileService.updateActivationById(id, request);

        return ResponseEntity.ok(file);

    }

}
