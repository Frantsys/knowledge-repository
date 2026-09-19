package com.frantsys.knowledge_repository.modules.File.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class FileResponse {
    
    private Long id;
    private Long path_id;
    private String size;
    private String type;
    private Boolean readOnly;
    private String name;
    private String createdBy;
    private LocalDateTime createdAt;


}
