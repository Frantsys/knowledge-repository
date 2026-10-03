package com.frantsys.knowledge_repository.modules.Comment.mapper;

import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.request.CommentReplyCreateRequest;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentResponse;
import com.frantsys.knowledge_repository.modules.Comment.dto.response.CommentSummaryResponse;
import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "replies", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Comment toEntity(CommentCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "replies", ignore = true)
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    Comment toReplyEntity(CommentReplyCreateRequest request);

    @Mapping(target = "materialId", source = "material.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "parentId", source = "parent.id")
    CommentResponse toResponse(Comment comment);

    CommentSummaryResponse toSummaryResponse(Comment comment);

}
