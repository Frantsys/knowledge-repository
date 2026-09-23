package com.frantsys.knowledge_repository.modules.File.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class FileUpdateActivationRequest {

    @NotNull(message = "Status do arquivo não pode ser nulo")
    private Boolean isActive;
    
}
