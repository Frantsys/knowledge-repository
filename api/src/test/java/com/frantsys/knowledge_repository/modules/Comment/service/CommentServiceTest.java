package com.frantsys.knowledge_repository.modules.Comment.service;

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

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentService commentService;

    @Test
    @DisplayName("createComment should attach the material and set default fields")
    void createComment_shouldLinkMaterialAndSetDefaults() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setMaterialId(10L);
        request.setBody("Great material!");

        Comment mappedComment = new Comment();
        Material material = new Material();
        CommentResponse response = new CommentResponse();

        when(commentMapper.toEntity(request)).thenReturn(mappedComment);
        when(materialRepository.getReferenceById(10L)).thenReturn(material);
        when(commentRepository.save(mappedComment)).thenReturn(mappedComment);
        when(commentMapper.toResponse(mappedComment)).thenReturn(response);

        CommentResponse result = commentService.createComment(request);

        assertThat(result).isSameAs(response);
        assertThat(mappedComment.getMaterial()).isSameAs(material);
        assertEquals(0, mappedComment.getLikes());
        assertThat(mappedComment.getIsActive()).isTrue();
        assertThat(mappedComment.getCreatedAt()).isNotNull();
        assertThat(mappedComment.getUpdatedAt()).isNull();
    }

    @Test
    @DisplayName("createComment should not look up a material when materialId is null")
    void createComment_shouldSkipMaterialLookupWhenMaterialIdIsNull() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setBody("Great material!");

        Comment mappedComment = new Comment();
        when(commentMapper.toEntity(request)).thenReturn(mappedComment);
        when(commentRepository.save(mappedComment)).thenReturn(mappedComment);
        when(commentMapper.toResponse(mappedComment)).thenReturn(new CommentResponse());

        commentService.createComment(request);

        verify(materialRepository, never()).getReferenceById(any());
        assertThat(mappedComment.getMaterial()).isNull();
    }

    @Test
    @DisplayName("createReply should link the parent comment and the author when the parent id matches")
    void createReply_shouldLinkParentAndUserWhenParentIdMatches() {
        CommentReplyCreateRequest request = new CommentReplyCreateRequest();
        request.setParentId(5L);
        request.setBody("I agree!");

        Comment replyComment = new Comment();
        Comment parentComment = new Comment();

        User expectedAuthor = new User();
        Comment commentActingAsUserHolder = new Comment();
        commentActingAsUserHolder.setUser(expectedAuthor);

        when(commentMapper.toEntityReply(request)).thenReturn(replyComment);
        when(commentRepository.getReferenceById(5L)).thenReturn(parentComment);
        when(commentRepository.getReferenceById(7L)).thenReturn(commentActingAsUserHolder);
        when(commentRepository.save(replyComment)).thenReturn(replyComment);
        when(commentMapper.toResponse(replyComment)).thenReturn(new CommentResponse());

        commentService.createReply(5L, request, 7L);

        assertThat(replyComment.getParent()).isSameAs(parentComment);
        assertThat(replyComment.getUser()).isSameAs(expectedAuthor);
        assertEquals(0, replyComment.getLikes());
        assertThat(replyComment.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("createReply should not link anything when the parent id does not match the request")
    void createReply_shouldNotLinkWhenParentIdDoesNotMatch() {
        CommentReplyCreateRequest request = new CommentReplyCreateRequest();
        request.setParentId(99L);
        request.setBody("I agree!");

        Comment replyComment = new Comment();
        when(commentMapper.toEntityReply(request)).thenReturn(replyComment);
        when(commentRepository.save(replyComment)).thenReturn(replyComment);
        when(commentMapper.toResponse(replyComment)).thenReturn(new CommentResponse());

        commentService.createReply(5L, request, 7L);

        assertThat(replyComment.getParent()).isNull();
        assertThat(replyComment.getUser()).isNull();
        verify(commentRepository, never()).getReferenceById(any());
    }

    @Test
    @DisplayName("updateById should update the body and set the updatedAt timestamp")
    void updateById_shouldUpdateBodyAndTimestamp() {
        Comment existingComment = new Comment();
        existingComment.setBody("Old body");

        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setBody("New body");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(existingComment)).thenReturn(existingComment);
        when(commentMapper.toResponse(existingComment)).thenReturn(new CommentResponse());

        commentService.updateById(1L, request);

        assertEquals("New body", existingComment.getBody());
        assertThat(existingComment.getUpdatedAt()).isNotNull();
    }

    @Test
    @DisplayName("updateById should throw an exception when the comment does not exist")
    void updateById_shouldThrowExceptionWhenCommentNotFound() {
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> commentService.updateById(99L, new CommentUpdateRequest()));
    }

    @Test
    @DisplayName("findAll should return every comment mapped to CommentResponse")
    void findAll_shouldReturnMappedComments() {
        Comment comment = new Comment();
        CommentResponse response = new CommentResponse();

        when(commentRepository.findAll()).thenReturn(List.of(comment));
        when(commentMapper.toResponse(comment)).thenReturn(response);

        List<CommentResponse> result = commentService.findAll();

        assertThat(result).containsExactly(response);
    }

    @Test
    @DisplayName("findAllSummary should return every comment mapped to CommentSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        Comment comment = new Comment();
        CommentSummaryResponse summary = new CommentSummaryResponse();

        when(commentRepository.findAll()).thenReturn(List.of(comment));
        when(commentMapper.toSummaryResponse(comment)).thenReturn(summary);

        List<CommentSummaryResponse> result = commentService.findAllSummary();

        assertThat(result).containsExactly(summary);
    }

    @Test
    @DisplayName("findById should return the mapped comment when found")
    void findById_shouldReturnComment() {
        Comment comment = new Comment();
        CommentResponse response = new CommentResponse();

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentMapper.toResponse(comment)).thenReturn(response);

        CommentResponse result = commentService.findById(1L);

        assertThat(result).isSameAs(response);
    }

    @Test
    @DisplayName("findById should throw an exception when the comment does not exist")
    void findById_shouldThrowExceptionWhenNotFound() {
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> commentService.findById(99L));
    }

}