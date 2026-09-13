package com.frantsys.knowledge_repository.modules.User.dto;

import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import lombok.Getter;

@Getter 
public class UserSummaryResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;

}
