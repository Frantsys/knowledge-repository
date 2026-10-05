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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
    private UserRepository userRepository;

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentService commentService;

    private User author;

    @BeforeEach
    void setUp() {
        author = new User();
        author.setFirstName("Anna");
        author.setLastName("Smith");
    }

    @Test
    @DisplayName("create should attach the material and the author and set default fields")
    void create_shouldLinkMaterialAndAuthorAndSetDefaults() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setMaterialId(10L);
        request.setBody("Great material!");

        Comment mappedComment = new Comment();
        Material material = new Material();
        CommentResponse response = new CommentResponse();

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(materialRepository.findById(10L)).thenReturn(Optional.of(material));
        when(commentMapper.toEntity(request)).thenReturn(mappedComment);
        when(commentRepository.save(mappedComment)).thenReturn(mappedComment);
        when(commentMapper.toResponse(mappedComment)).thenReturn(response);

        CommentResponse result = commentService.create("anna@example.com", request);

        assertThat(result).isSameAs(response);
        assertThat(mappedComment.getMaterial()).isSameAs(material);
        assertThat(mappedComment.getUser()).isSameAs(author);
        assertEquals("Anna Smith", mappedComment.getCreatedBy());
        assertEquals(0, mappedComment.getLikes());
        assertThat(mappedComment.getIsActive()).isTrue();
        assertThat(mappedComment.getUpdatedAt()).isNull();
    }

    @Test
    @DisplayName("create should throw an exception when the material does not exist")
    void create_shouldThrowExceptionWhenMaterialNotFound() {
        CommentCreateRequest request = new CommentCreateRequest();
        request.setMaterialId(99L);

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.create("anna@example.com", request));

        verify(commentRepository, never()).save(any());
    }

    @Test
    @DisplayName("createReply should link the parent comment, its material and the author")
    void createReply_shouldLinkParentMaterialAndAuthor() {
        CommentReplyCreateRequest request = new CommentReplyCreateRequest();
        request.setBody("I agree!");

        Material material = new Material();
        Comment parent = new Comment();
        parent.setMaterial(material);
        Comment mappedReply = new Comment();
        CommentResponse response = new CommentResponse();

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(commentRepository.findById(5L)).thenReturn(Optional.of(parent));
        when(commentMapper.toReplyEntity(request)).thenReturn(mappedReply);
        when(commentRepository.save(mappedReply)).thenReturn(mappedReply);
        when(commentMapper.toResponse(mappedReply)).thenReturn(response);

        CommentResponse result = commentService.createReply("anna@example.com", 5L, request);

        assertThat(result).isSameAs(response);
        assertThat(mappedReply.getParent()).isSameAs(parent);
        assertThat(mappedReply.getMaterial()).isSameAs(material);
        assertThat(mappedReply.getUser()).isSameAs(author);
        assertEquals(0, mappedReply.getLikes());
        assertThat(mappedReply.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("createReply should throw an exception when the parent comment does not exist")
    void createReply_shouldThrowExceptionWhenParentNotFound() {
        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.createReply("anna@example.com", 99L, new CommentReplyCreateRequest()));

        verify(commentRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateById should update the body and set the updatedAt timestamp")
    void updateById_shouldUpdateBodyAndTimestamp() {
        Comment comment = new Comment();
        comment.setBody("Old body");

        CommentUpdateRequest request = new CommentUpdateRequest();
        request.setBody("New body");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        when(commentRepository.save(comment)).thenReturn(comment);
        when(commentMapper.toResponse(comment)).thenReturn(new CommentResponse());

        commentService.updateById(1L, request);

        assertEquals("New body", comment.getBody());
        assertThat(comment.getUpdatedAt()).isNotNull();
        verify(commentRepository).save(comment);
    }

    @Test
    @DisplayName("updateById should throw an exception when the comment does not exist")
    void updateById_shouldThrowExceptionWhenNotFound() {
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> commentService.updateById(99L, new CommentUpdateRequest()));
    }

    @Test
    @DisplayName("findAll should return every comment mapped to CommentResponse")
    void findAll_shouldReturnMappedComments() {
        Comment comment = new Comment();
        CommentResponse response = new CommentResponse();

        when(commentRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(comment)));
        when(commentMapper.toResponse(comment)).thenReturn(response);

        Page<CommentResponse> result = commentService.findAll(PageRequest.of(0, 10));

        assertThat(result.getContent()).containsExactly(response);
    }

    @Test
    @DisplayName("findAllSummary should return every comment mapped to CommentSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        Comment comment = new Comment();
        CommentSummaryResponse summary = new CommentSummaryResponse();

        when(commentRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(comment)));
        when(commentMapper.toSummaryResponse(comment)).thenReturn(summary);

        Page<CommentSummaryResponse> result = commentService.findAllSummary(PageRequest.of(0, 10));

        assertThat(result.getContent()).containsExactly(summary);
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

        assertThrows(ResourceNotFoundException.class, () -> commentService.findById(99L));
    }

}
