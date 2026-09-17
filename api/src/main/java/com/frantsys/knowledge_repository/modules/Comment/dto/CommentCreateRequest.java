package com.frantsys.knowledge_repository.modules.Comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class CommentCreateRequest {

    @NotNull(message = "Material não pode ser nulo")
    private Long materialId;

    @NotNull(message = "Autor não pode ser nulo")
    private Long userId;

    @NotBlank(message = "O comentário é obrigatório")
    @Size(min = 1, max = 254, message = "O comentário deve ter entre 1 a 254 caracteres")
    private String body;

}
