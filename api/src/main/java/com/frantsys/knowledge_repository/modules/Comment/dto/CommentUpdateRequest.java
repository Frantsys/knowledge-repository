package com.frantsys.knowledge_repository.modules.Comment.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CommentUpdateRequest {

    private String body;
    private LocalDateTime updatedAt;
    
}
