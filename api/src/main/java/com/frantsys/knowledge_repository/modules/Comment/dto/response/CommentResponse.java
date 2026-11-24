package com.frantsys.knowledge_repository.modules.Comment.dto.response;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CommentResponse {

    private Long id;
    private Long materialId;
    private Long userId;
    private Long parentId;
    private String body;
    private Integer likes;
    private LocalDateTime updatedAt;
    private String createdBy;
    // Foto do autor do comentário; null quando ele não tem foto
    private String authorAvatarUrl;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
