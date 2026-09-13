package com.frantsys.knowledge_repository.modules.User.dto;

import java.time.LocalDate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class UserCreateRequest {

    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 14, max = 14, message = "CPF deve ter 11 números")
    @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", message = "CPF inválido")
    private String cpf;

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    private String firstName;

    @NotBlank(message = "Sobrenome é obrigatório")
    @Size(min = 2, max = 100, message = "Sobrenome deve ter entre 2 e 100 caracteres")
    private String lastName;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, max = 128, message = "Senha deve ter no mínimo 8 caracteres")
    private String password;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^(?:\\+?55\\s?)?(?:\\(?([1-9][1-9])\\)?\\s?)?(?:((?:9\\d|[2-9])\\d{3})\\s?-?\\s?(\\d{4}))$", message = "Telefone inválido")
    private String phoneNumber;

    @NotBlank(message = "Gênero é obrigatório")
    private String gender;

    @NotBlank(message = "Curso é obrigatório")
    private String course;

    @NotNull(message = "Endereço é obrigatório")
    @Valid 
    private UserAddressCreateRequest address;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve estar no passado")
    private LocalDate birthDate;
    
}
