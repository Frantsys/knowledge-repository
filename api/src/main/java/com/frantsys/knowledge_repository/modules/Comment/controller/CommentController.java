package com.frantsys.knowledge_repository.modules.Comment.controller;

import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentReplyCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentUpdateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentSummaryResponse;
import com.frantsys.knowledge_repository.modules.Comment.service.CommentService;
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

@Tag(name = "Comment", description = "API path for managing comments")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/v1/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "Lista comentários (paginado)")
    @GetMapping
    public ResponseEntity<Page<CommentResponse>> findAll(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CommentResponse> comments = commentService.findAll(pageable);

        return ResponseEntity.ok(comments);

    }

    @Operation(summary = "Lista resumo dos comentários (paginado)")
    @GetMapping("/summary")
    public ResponseEntity<Page<CommentSummaryResponse>> findAllSummary(@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<CommentSummaryResponse> comments = commentService.findAllSummary(pageable);

        return ResponseEntity.ok(comments);

    }

    @Operation(summary = "Busca um comentário pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> findById(@PathVariable Long id) {

        CommentResponse comment = commentService.findById(id);

        return ResponseEntity.ok(comment);

    }

    @Operation(summary = "Cria um comentário em um material")
    @PostMapping
    public ResponseEntity<CommentResponse> create(Authentication authentication, @RequestBody @Valid CommentCreateRequest request) {

        CommentResponse comment = commentService.create(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);

    }

    @Operation(summary = "Responde a um comentário")
    @PostMapping("/{parentId}/replies")
    public ResponseEntity<CommentResponse> createReply(Authentication authentication, @PathVariable Long parentId, @RequestBody @Valid CommentReplyCreateRequest request) {

        CommentResponse comment = commentService.createReply(authentication.getName(), parentId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);

    }

    @Operation(summary = "Atualiza um comentário (dono ou admin)")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCommentOwner(#id, authentication.name)")
    @PatchMapping("/{id}")
    public ResponseEntity<CommentResponse> update(@PathVariable Long id, @RequestBody @Valid CommentUpdateRequest request) {

        CommentResponse comment = commentService.updateById(id, request);

        return ResponseEntity.ok(comment);

    }

}
