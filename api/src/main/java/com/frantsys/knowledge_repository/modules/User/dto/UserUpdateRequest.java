package com.frantsys.knowledge_repository.modules.User.dto;

public record UserUpdateRequest(
    String firstName,
    String lastname,
    String phoneNumber,
    UserAddressCreateRequest address,
    String course
) {}
