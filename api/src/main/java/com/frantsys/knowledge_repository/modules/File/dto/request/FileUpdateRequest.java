package com.frantsys.knowledge_repository.modules.File.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileUpdateRequest {

    private Boolean readOnly;
    private String name;

}
