package com.frantsys.knowledge_repository.modules.Material.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.frantsys.knowledge_repository.modules.Material.dto.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.model.Material;

@Mapper(componentModel = "spring")
public interface MaterialMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "views", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "user", ignore = true)
    Material toEntity(MaterialCreateRequest request);

    @Mapping(source = "user.id", target = "userId")
    MaterialResponse toResponse(Material request);

}
