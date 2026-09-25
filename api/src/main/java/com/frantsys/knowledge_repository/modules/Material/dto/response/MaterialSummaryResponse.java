package com.frantsys.knowledge_repository.modules.Material.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MaterialSummaryResponse {

    private Long id;
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
