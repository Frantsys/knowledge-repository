package com.frantsys.knowledge_repository.modules.Comment.service;

import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentReplyCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentUpdateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentSummaryResponse;
import com.frantsys.knowledge_repository.modules.Comment.mapper.CommentMapper;
import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import com.frantsys.knowledge_repository.modules.Comment.repository.CommentRepository;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Transactional(readOnly = true)
    public Page<CommentResponse> findAll(Pageable pageable) {

        return commentRepository.findAll(pageable)
                .map(commentMapper::toResponse);

    }

    @Transactional(readOnly = true)
    public Page<CommentSummaryResponse> findAllSummary(Pageable pageable) {

        return commentRepository.findAll(pageable)
                .map(commentMapper::toSummaryResponse);

    }

    @Transactional(readOnly = true)
    public CommentResponse findById(Long id) {

        Comment comment = findCommentById(id);

        return commentMapper.toResponse(comment);

    }

    @Transactional
    public CommentResponse create(String authorEmail, CommentCreateRequest request) {

        User author = findUserByEmail(authorEmail);

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com ID: " + request.getMaterialId()));

        Comment comment = commentMapper.toEntity(request);

        comment.setMaterial(material);

        return save(comment, author);

    }

    @Transactional
    public CommentResponse createReply(String authorEmail, Long parentId, CommentReplyCreateRequest request) {

        User author = findUserByEmail(authorEmail);

        Comment parent = findCommentById(parentId);

        Comment reply = commentMapper.toReplyEntity(request);

        reply.setParent(parent);
        reply.setMaterial(parent.getMaterial());

        return save(reply, author);

    }

    @Transactional
    public CommentResponse updateById(Long id, CommentUpdateRequest request) {

        Comment comment = findCommentById(id);

        comment.setBody(request.getBody());
        comment.setUpdatedAt(LocalDateTime.now());

        Comment updatedComment = commentRepository.save(comment);

        return commentMapper.toResponse(updatedComment);

    }

    private CommentResponse save(Comment comment, User author) {

        comment.setUser(author);
        comment.setCreatedBy(author.getFullName());
        comment.setLikes(0);
        comment.setIsActive(true);

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toResponse(savedComment);

    }

    private Comment findCommentById(Long id) {

        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado com ID: " + id));

    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));

    }

}
