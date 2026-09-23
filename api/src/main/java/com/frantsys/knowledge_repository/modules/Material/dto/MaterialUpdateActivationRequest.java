package com.frantsys.knowledge_repository.modules.Material.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MaterialUpdateActivationRequest {

    @NotNull(message = "Status do material não pode ser nulo")
    private Boolean isActive;
    
}
