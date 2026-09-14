package com.frantsys.knowledge_repository.modules.User.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class UserResponse {
    
    private Long id;
    private String cpf;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String gender;
    private String course;
    private UserAddressCreateRequest address;
    private LocalDate birthDate;
    private UserRole role;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
