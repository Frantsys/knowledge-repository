package com.frantsys.knowledge_repository.modules.User.dto;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserUpdateRequest {
    
    private String firstName;
    private String lastname;
    private String phoneNumber;
    private UserAddressCreateRequest address;
    private String course;

}
