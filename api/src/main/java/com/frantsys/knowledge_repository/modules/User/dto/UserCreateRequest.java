package com.frantsys.knowledge_repository.modules.User.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(
        min = 2,
        max = 50,
        message = "Nome deve ter entre 2 e 50 caracteres"
    )
    private String firstName;

    @Size(
        min = 2,
        max = 100,
        message = "Sobrenome deve ter entre 2 e 100 caracteres"
    )
    private String lastName;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(
        min = 8,
        max = 128,
        message = "Senha deve ter no mínimo 8 caracteres"
    )
    private String password;

    private String cpf;

    private String phoneNumber;

    private String gender;

    private String course;

    private UserAddressCreateRequest address;

    private LocalDate birthDate;
}