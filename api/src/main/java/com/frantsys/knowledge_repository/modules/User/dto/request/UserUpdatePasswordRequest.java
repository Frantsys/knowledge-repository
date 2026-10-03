package com.frantsys.knowledge_repository.modules.User.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdatePasswordRequest {

    @NotBlank(message = "Senha atual é obrigatória")
    private String currentPassword;

    @NotBlank(message = "Nova senha é obrigatória")
    @Size(min = 8, max = 128, message = "Nova senha deve ter entre 8 e 128 caracteres")
    private String newPassword;

}
