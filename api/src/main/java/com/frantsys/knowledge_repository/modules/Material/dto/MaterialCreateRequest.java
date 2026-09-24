package com.frantsys.knowledge_repository.modules.Material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class MaterialCreateRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 3, max = 128, message = "Título deve ter entre 3 a 128 caracteres")
    private String title;

    @NotBlank(message = "Conteúdo do material é obrigatório")
    @Size(min = 3, max = 1000, message = "Conteúdo do material deve ter entre 3 a 1000 caracteres")
    private String body;

    @NotBlank(message = "Assunto é obrigatório")
    @Size(min = 3, max = 128, message = "Assunto deve ter entre 3 a 128 caracteres")
    private String subject;

    @NotBlank(message = "Curso é obrigatório")
    @Size(min = 3, max = 128, message = "Curso deve ter entre 3 e 128 caracteres")
    private String course;

}
