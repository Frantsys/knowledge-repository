package com.frantsys.knowledge_repository.modules.User.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserAddressCreateRequest {
    
    @NotBlank(message = "País é obrigatório")
    private String country;

    @NotBlank(message = "Estado é obrigatório")
    private String state;

    @NotBlank(message = "Cidade é obrigatória")
    private String city;

    @NotBlank(message = "Rua é obrigatória")
    private String street;

    @NotBlank(message = "Número é obrigatório")
    private Integer number;
    
    @NotBlank(message = "Bairro é obrigatório")
    private String district;

    @NotBlank(message = "CEP é obrigatório")
    @Pattern(regexp = "\\d{5}-\\d{3}", message = "CEP inválido")
    private String zipcode;

}
