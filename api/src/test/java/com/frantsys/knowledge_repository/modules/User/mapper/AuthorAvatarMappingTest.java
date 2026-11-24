package com.frantsys.knowledge_repository.modules.User.mapper;

import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.mapper.CommentMapperImpl;
import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.mapper.MaterialMapperImpl;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.User.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

// Usa os mappers gerados pelo MapStruct (não mocks): garante que a foto do autor chega em materiais e comentários
class AuthorAvatarMappingTest {

    private final UserMapper userMapper = new UserMapperImpl();
    private final MaterialMapperImpl materialMapper = new MaterialMapperImpl();
    private final CommentMapperImpl commentMapper = new CommentMapperImpl();

    private User author;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(materialMapper, "userMapper", userMapper);
        ReflectionTestUtils.setField(commentMapper, "userMapper", userMapper);

        author = new User();
        author.setId(7L);
        author.setFirstName("Ana");
        author.setAvatarKey("abc-123");
    }

    @Test
    @DisplayName("material response should carry the author's photo URL")
    void material_includesAuthorAvatar() {
        Material material = new Material();
        material.setUser(author);

        MaterialResponse response = materialMapper.toResponse(material);

        assertThat(response.getUser().getAvatarUrl()).isEqualTo("/v1/api/users/avatars/abc-123");
    }

    @Test
    @DisplayName("comment response should carry the author's photo URL")
    void comment_includesAuthorAvatar() {
        Comment comment = new Comment();
        comment.setUser(author);

        CommentResponse response = commentMapper.toResponse(comment);

        assertThat(response.getAuthorAvatarUrl()).isEqualTo("/v1/api/users/avatars/abc-123");
    }

    @Test
    @DisplayName("author without a photo should map to a null URL")
    void withoutPhoto_mapsToNull() {
        author.setAvatarKey(null);
        Comment comment = new Comment();
        comment.setUser(author);
        Material material = new Material();
        material.setUser(author);

        assertThat(commentMapper.toResponse(comment).getAuthorAvatarUrl()).isNull();
        assertThat(materialMapper.toResponse(material).getUser().getAvatarUrl()).isNull();
    }

}
