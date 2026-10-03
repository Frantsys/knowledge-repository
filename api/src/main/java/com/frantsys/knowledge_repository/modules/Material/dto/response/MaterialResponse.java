package com.frantsys.knowledge_repository.modules.Material.dto.response;

import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MaterialResponse {

    private Long id;
    private Long userId;
    private UserSummaryResponse user;
    private String title;
    private String body;
    private String subject;
    private String course;
    private Integer likes;
    private Integer views;
    private LocalDateTime updatedAt;
    private String createdBy;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
