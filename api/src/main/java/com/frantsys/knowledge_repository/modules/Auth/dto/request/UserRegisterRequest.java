package com.frantsys.knowledge_repository.modules.Auth.dto.request;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserAddressCreateRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Getter
@Setter
public class UserRegisterRequest {

    @NotBlank(message = "CPF é obrigatório")
    @CPF(message = "CPF deve ser válido")
    @Pattern(regexp = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", message = "CPF deve estar no formato 000.000.000-00")
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
    @Size(min = 8, max = 128, message = "Senha deve ter entre 8 e 128 caracteres")
    private String password;

    @NotBlank(message = "Telefone é obrigatório")
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
