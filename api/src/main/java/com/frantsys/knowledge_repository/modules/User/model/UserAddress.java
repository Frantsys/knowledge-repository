package com.frantsys.knowledge_repository.modules.User.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAddress {
    
    private String country;
    private String state;
    private String city;
    private String street;
    private String number;
    private String district;
    private String zipcode;

}
