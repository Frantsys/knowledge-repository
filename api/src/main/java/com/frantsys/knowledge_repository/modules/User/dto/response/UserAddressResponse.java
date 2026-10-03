package com.frantsys.knowledge_repository.modules.User.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAddressResponse {

    private String country;
    private String state;
    private String city;
    private String street;
    private String number;
    private String district;
    private String zipcode;

}
