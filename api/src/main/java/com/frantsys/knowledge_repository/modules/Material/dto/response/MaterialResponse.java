package com.frantsys.knowledge_repository.modules.Material.dto.response;

import java.time.LocalDateTime;

import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MaterialResponse {
    
    private Long id;
    private Long userId;
    private UserResponse user;
    private String title;
    private String body;
    private String subject;
    private String course;
    private Long likes;
    private LocalDateTime updatedAt;
    private String createdBy;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
