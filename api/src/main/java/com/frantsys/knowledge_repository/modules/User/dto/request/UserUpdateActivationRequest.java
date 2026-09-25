package com.frantsys.knowledge_repository.modules.User.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserUpdateActivationRequest {

    @NotNull(message = "Status do usuário não pode ser nulo")
    private Boolean isActive;
    
}
