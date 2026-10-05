package com.frantsys.knowledge_repository.modules.File.controller;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import com.frantsys.knowledge_repository.modules.File.service.FileService;
import com.frantsys.knowledge_repository.modules.File.model.File;
import com.frantsys.knowledge_repository.modules.File.storage.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

@Tag(name = "File", description = "API path for managing files")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;
    private final StorageService storageService;

    @Operation(summary = "Lista arquivos (paginado)")
    @GetMapping
    public ResponseEntity<Page<FileResponse>> findAll(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<FileResponse> files = fileService.findAll(pageable);

        return ResponseEntity.ok(files);

    }

    @Operation(summary = "Lista resumo dos arquivos (paginado)")
    @GetMapping("/summary")
    public ResponseEntity<Page<FileSummaryResponse>> findAllSummary(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<FileSummaryResponse> files = fileService.findAllSummary(pageable);

        return ResponseEntity.ok(files);

    }

    @Operation(summary = "Busca os metadados de um arquivo")
    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> findById(@PathVariable Long id) {

        FileResponse file = fileService.findById(id);

        return ResponseEntity.ok(file);

    }

    // multipart/form-data: campos materialId, readOnly, name (opcional) e a parte "file" com o arquivo
    @Operation(summary = "Envia um arquivo (multipart/form-data) para um material do usuário")
    @PreAuthorize("@securityService.isMaterialOwner(#request.materialId, authentication.name)")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> create(Authentication authentication,
                                               @Valid @ModelAttribute FileCreateRequest request,
                                               @RequestParam("file") MultipartFile file) {

        FileResponse response = fileService.create(authentication.getName(), request, file);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @Operation(summary = "Baixa o conteúdo de um arquivo")
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {

        File file = fileService.findEntityById(id);

        Resource resource = storageService.load(file.getPathId());

        // attachment: o navegador baixa o arquivo em vez de renderizá-lo
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(file.getName(), StandardCharsets.UTF_8).build().toString())
                .body(resource);

    }

    @Operation(summary = "Atualiza os metadados de um arquivo")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR') or @securityService.isFileOwner(#id, authentication.name)")
    @PatchMapping("/{id}")
    public ResponseEntity<FileResponse> update(@PathVariable Long id, @RequestBody @Valid FileUpdateRequest request) {

        FileResponse file = fileService.updateById(id, request);

        return ResponseEntity.ok(file);

    }

    @Operation(summary = "Ativa ou desativa um arquivo")
    @PreAuthorize("hasAnyRole('ADMIN','MODERATOR') or @securityService.isFileOwner(#id, authentication.name)")
    @PatchMapping("/{id}/activation")
    public ResponseEntity<FileResponse> updateActivation(@PathVariable Long id, @RequestBody @Valid FileUpdateActivationRequest request) {

        FileResponse file = fileService.updateActivationById(id, request);

        return ResponseEntity.ok(file);

    }

}
