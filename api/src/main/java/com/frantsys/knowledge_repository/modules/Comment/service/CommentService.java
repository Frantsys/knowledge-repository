package com.frantsys.knowledge_repository.modules.Comment.service;

import java.time.LocalDateTime;
import java.util.List;

import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentReplyCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentUpdateRequest;
import com.frantsys.knowledge_repository.modules.Comment.mapper.CommentMapper;
import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import com.frantsys.knowledge_repository.modules.Comment.repository.CommentRepository;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor  
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final MaterialRepository materialRepository;
    private final CommentMapper commentMapper;

    @Transactional
    public CommentResponse createComment(CommentCreateRequest request) {

        Comment comment = commentMapper.toEntity(request);

        if(request.getMaterialId() != null) {
            Material materialRef = materialRepository.getReferenceById(request.getMaterialId());

            comment.setMaterial(materialRef);
        }

        comment.setLikes(0);
        comment.setUpdatedAt(null);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setIsActive(true);

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toResponse(savedComment);

    }

    @Transactional
    public CommentResponse createReply(Long parentId, CommentReplyCreateRequest request, Long userId) {
        
        Comment comment = commentMapper.toEntityReply(request);

        if(request.getParentId() != null && request.getParentId().equals(parentId)) {
            Comment commentParent = commentRepository.getReferenceById(request.getParentId());
            comment.setParent(commentParent);

            User userRef = commentRepository.getReferenceById(userId).getUser();
            comment.setUser(userRef);
        }

        comment.setLikes(0);
        comment.setUpdatedAt(null);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setIsActive(true);

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toResponse(savedComment);

    }

    @Transactional
    public CommentResponse updateById(Long id, CommentUpdateRequest request) {

        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + id));

        comment.setBody(request.getBody());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toResponse(savedComment);

    }

    @Transactional(readOnly = true)
    public List<CommentResponse> findAll() {
        
        return commentRepository.findAll()
            .stream()
            .map(commentMapper::toResponse)
            .toList();

    }

    @Transactional(readOnly = true)
    public List<CommentSummaryResponse> findAllSummary() {

        return commentRepository.findAll()
                .stream()
                .map(commentMapper::toSummaryResponse)
                .toList();

    }

    @Transactional(readOnly = true)
    public CommentResponse findById(Long id) {

        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comentário não encontrado com ID: " + id));

        return commentMapper.toResponse(comment);

    }

}
