package com.frantsys.knowledge_repository.modules.Material.mapper;

import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface MaterialMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "views", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Material toEntity(MaterialCreateRequest request);

    @Mapping(target = "userId", source = "user.id")
    MaterialResponse toResponse(Material material);

    MaterialSummaryResponse toSummaryResponse(Material material);

}
