package com.frantsys.knowledge_repository.modules.Comment.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.frantsys.knowledge_repository.modules.Comment.dto.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.model.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Comment toEntity(CommentCreateRequest request);

    @Mapping(target = "materialId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    CommentResponse toResponse(Comment request);
    
}
