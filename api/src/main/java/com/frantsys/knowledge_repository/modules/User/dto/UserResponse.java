package com.frantsys.knowledge_repository.modules.User.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.frantsys.knowledge_repository.modules.User.model.UserAddress;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import lombok.Getter;

@Getter 
public class UserResponse {
    
    private Long id;
    private String cpf;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String gender;
    private String course;
    private UserAddress address;
    private LocalDate birthDate;
    private UserRole role;
    private LocalDateTime createdAt;
    private Boolean isActive;

}
