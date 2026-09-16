package com.frantsys.knowledge_repository.modules.Material.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MaterialUpdateRequest {
    
    private Long id;
    private String title;
    private String body;
    private String subject;
    private String course;
    
}
