package com.frantsys.knowledge_repository.modules.File.mapper;

import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.model.File;

@Mapper(componentModel = "spring")
public interface FileMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    File toEntity(FileCreateRequest request);

    FileResponse toResponse(File response);

    FileSummaryResponse toSummaryResponse(File response);

}
