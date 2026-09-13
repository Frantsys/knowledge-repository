package com.frantsys.knowledge_repository.modules.User.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.frantsys.knowledge_repository.modules.User.dto.UserAddressCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserAddress;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    User toEntity(UserCreateRequest request);

    UserAddress toAddressEntity(UserAddressCreateRequest request);

    UserResponse toResponse(User user);
    UserSummaryResponse toSummaryResponse(User user);

}
