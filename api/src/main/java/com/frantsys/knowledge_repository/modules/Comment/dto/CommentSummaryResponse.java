package com.frantsys.knowledge_repository.modules.Comment.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter 
public class CommentSummaryResponse {

    private Long id;
    private String body;
    private Integer likes;
    private LocalDateTime updatedAt;
    private String createdBy;
    private LocalDateTime createdAt;

}
