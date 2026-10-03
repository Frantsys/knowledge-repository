package com.frantsys.knowledge_repository.modules.Comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentReplyCreateRequest {

    @NotBlank(message = "O comentário é obrigatório")
    @Size(max = 254, message = "O comentário deve ter no máximo 254 caracteres")
    private String body;

}
