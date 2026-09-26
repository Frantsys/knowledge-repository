package com.frantsys.knowledge_repository.modules.Auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserLoginResponse {

    private String tokenType;
    private String token;

}
