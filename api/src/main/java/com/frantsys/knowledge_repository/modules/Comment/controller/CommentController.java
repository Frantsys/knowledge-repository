package com.frantsys.knowledge_repository.modules.Comment.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frantsys.knowledge_repository.modules.Comment.dto.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.service.CommentService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Tag(name = "Comment", description = "API path for managing comments")
@RestController 
@RequestMapping("/v1/api/comments")
@RequiredArgsConstructor 
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> findAll() {
        
        List<CommentResponse> comments = commentService.findAll();

        return ResponseEntity.ok(comments);

    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> findById(@PathVariable Long id) {
        
        CommentResponse comment = commentService.findById(id);

        return ResponseEntity.status(HttpStatus.FOUND).body(comment);

    }

    @PostMapping
    public ResponseEntity<CommentResponse> create(@RequestBody @Valid CommentCreateRequest request) {
        
        CommentResponse comment = commentService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(comment);

    }
    
}
