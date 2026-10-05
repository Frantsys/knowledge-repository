package com.frantsys.knowledge_repository.modules.File.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileCreateRequest {

    @NotNull(message = "Material não pode ser nulo")
    private Long materialId;

    @NotNull(message = "Definição de leitura não pode ser nula")
    private Boolean readOnly;

    // Se vazio, usa o nome original do arquivo enviado
    private String name;

}
