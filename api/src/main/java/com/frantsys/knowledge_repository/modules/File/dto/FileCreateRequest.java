package com.frantsys.knowledge_repository.modules.File.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class FileCreateRequest {
    
    @NotNull(message = "Material não pode ser nulo")
    private Long materialId;

    @NotNull(message = "Arquivo não pode ser nulo")
    private Long path_id;

    @NotBlank(message = "Tamanho é obrigatório")
    private String size;

    @NotBlank(message = "Tipo é obrigatório")
    private String type;

    @NotNull(message = "Definição de leitura não pode ser nulo")
    private Boolean readOnly;

    @NotNull(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "Criador é obrigatório")
    private String createdBy;

}
