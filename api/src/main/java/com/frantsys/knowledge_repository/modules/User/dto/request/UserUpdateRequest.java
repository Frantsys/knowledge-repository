package com.frantsys.knowledge_repository.modules.User.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @Size(min = 2, max = 50, message = "Nome deve ter entre 2 e 50 caracteres")
    private String firstName;

    @Size(min = 2, max = 100, message = "Sobrenome deve ter entre 2 e 100 caracteres")
    private String lastName;

    private String phoneNumber;

    private String course;

    @Valid
    private UserAddressCreateRequest address;

}
