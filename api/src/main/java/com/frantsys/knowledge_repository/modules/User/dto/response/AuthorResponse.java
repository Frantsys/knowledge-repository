package com.frantsys.knowledge_repository.modules.User.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

// Dados públicos de quem publicou um material: só nome e foto (sem e-mail, CPF ou contato)
@Getter
@AllArgsConstructor
public class AuthorResponse {

    private Long id;
    private String firstName;
    private String lastName;
    // Foto do autor (mesmo formato de UserResponse.avatarUrl); null sem foto
    private String avatarUrl;

}
