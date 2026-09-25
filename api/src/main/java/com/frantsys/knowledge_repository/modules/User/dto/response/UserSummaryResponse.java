package com.frantsys.knowledge_repository.modules.User.dto.response;

import com.frantsys.knowledge_repository.modules.User.model.UserRole;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class UserSummaryResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;

}
