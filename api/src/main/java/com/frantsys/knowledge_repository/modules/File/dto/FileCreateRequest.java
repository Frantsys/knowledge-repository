package com.frantsys.knowledge_repository.modules.File.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class FileCreateRequest {
    
    private Long materialId;
    private Long path_id;
    private String size;
    private String type;
    private Boolean readOnly;
    private String name;
    private String createdBy;

}
