package com.frantsys.knowledge_repository.modules.User.dto.response;

import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter 
@AllArgsConstructor
public class UserSummaryResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;

}
