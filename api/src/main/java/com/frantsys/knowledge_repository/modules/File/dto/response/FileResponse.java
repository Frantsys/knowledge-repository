package com.frantsys.knowledge_repository.modules.File.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class FileResponse {

    private Long id;
    private Long materialId;
    private Long pathId;
    private String size;
    private String type;
    private Boolean readOnly;
    private String name;
    private String createdBy;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
