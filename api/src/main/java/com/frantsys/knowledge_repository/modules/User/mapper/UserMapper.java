package com.frantsys.knowledge_repository.modules.User.mapper;

import com.frantsys.knowledge_repository.modules.Auth.dto.request.UserRegisterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserAddressCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "avatarKey", ignore = true)
    @Mapping(target = "avatarContentType", ignore = true)
    User toEntity(UserRegisterRequest request);

    UserAddress toAddressEntity(UserAddressCreateRequest request);

    @Mapping(target = "avatarUrl", expression = "java(avatarUrl(user))")
    UserResponse toResponse(User user);

    @Mapping(target = "avatarUrl", expression = "java(avatarUrl(user))")
    UserSummaryResponse toSummaryResponse(User user);

    // A chave muda a cada upload, então a URL também: o navegador pode guardar a imagem em cache para sempre
    @Named("avatarUrl")
    default String avatarUrl(User user) {
        return avatarPath(user.getAvatarKey());
    }

    // Usado também pelo CommentMapper para a foto do autor do comentário
    @Named("avatarPath")
    default String avatarPath(String avatarKey) {
        return avatarKey == null ? null : "/v1/api/users/avatars/" + avatarKey;
    }

}
