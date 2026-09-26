package com.frantsys.knowledge_repository.modules.User.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserAddressCreateRequest;
import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserRegisterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserAddress;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toEntity(UserRegisterRequest request);

    UserAddress toAddressEntity(UserAddressCreateRequest request);

    @Mapping(target = "address", source = "address")
    UserResponse toResponse(User response);
    
    UserSummaryResponse toSummaryResponse(User response);

}
