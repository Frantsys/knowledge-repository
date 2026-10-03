package com.frantsys.knowledge_repository.modules.Material.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialUpdateRequest {

    @Size(min = 3, max = 128, message = "Título deve ter entre 3 e 128 caracteres")
    private String title;

    @Size(min = 3, max = 1000, message = "Conteúdo do material deve ter entre 3 e 1000 caracteres")
    private String body;

    @Size(min = 3, max = 128, message = "Assunto deve ter entre 3 e 128 caracteres")
    private String subject;

    @Size(min = 3, max = 128, message = "Curso deve ter entre 3 e 128 caracteres")
    private String course;

}
