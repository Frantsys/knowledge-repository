package com.frantsys.knowledge_repository.modules.File.mapper;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import com.frantsys.knowledge_repository.modules.File.model.File;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "material", ignore = true)
    @Mapping(target = "pathId", ignore = true)
    @Mapping(target = "size", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    File toEntity(FileCreateRequest request);

    @Mapping(target = "materialId", source = "material.id")
    @Mapping(target = "downloadUrl", expression = "java(\"/v1/api/files/\" + file.getId() + \"/download\")")
    FileResponse toResponse(File file);

    FileSummaryResponse toSummaryResponse(File file);

}
