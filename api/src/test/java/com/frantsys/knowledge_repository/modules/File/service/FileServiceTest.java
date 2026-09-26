package com.frantsys.knowledge_repository.modules.File.service;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import com.frantsys.knowledge_repository.modules.File.mapper.FileMapper;
import com.frantsys.knowledge_repository.modules.File.model.File;
import com.frantsys.knowledge_repository.modules.File.repository.FileRepository;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FileServiceTest {

    @Mock
    private FileRepository fileRepository;

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private FileMapper fileMapper;

    @InjectMocks
    private FileService fileService;

    private File existingFile;

    @BeforeEach
    void setUp() {
        existingFile = new File();
        existingFile.setPath_id(1L);
        existingFile.setSize("100KB");
        existingFile.setType("txt");
        existingFile.setReadOnly(false);
        existingFile.setName("original.txt");
    }

    @Test
    @DisplayName("createFile should link the material and copy its createdBy")
    void createFile_shouldLinkMaterialAndSetDefaults() {
        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(10L);

        File mappedFile = new File();
        Material material = new Material();
        material.setCreatedBy("prof.silva");

        when(fileMapper.toEntity(request)).thenReturn(mappedFile);
        when(materialRepository.getReferenceById(10L)).thenReturn(material);
        when(fileRepository.save(mappedFile)).thenReturn(mappedFile);
        when(fileMapper.toResponse(mappedFile)).thenReturn(new FileResponse());

        fileService.createFile(request);

        assertThat(mappedFile.getMaterial()).isSameAs(material);
        assertEquals("prof.silva", mappedFile.getCreatedBy());
        assertThat(mappedFile.getIsActive()).isTrue();
        assertThat(mappedFile.getCreatedAt()).isNotNull();
    }

    @Test
    @DisplayName("createFile should not look up a material when materialId is null")
    void createFile_shouldSkipMaterialLookupWhenMaterialIdIsNull() {
        FileCreateRequest request = new FileCreateRequest();

        File mappedFile = new File();
        when(fileMapper.toEntity(request)).thenReturn(mappedFile);
        when(fileRepository.save(mappedFile)).thenReturn(mappedFile);
        when(fileMapper.toResponse(mappedFile)).thenReturn(new FileResponse());

        fileService.createFile(request);

        verify(materialRepository, never()).getReferenceById(any());
        assertThat(mappedFile.getMaterial()).isNull();
    }

    @Test
    @DisplayName("updateById should update path_id, readOnly and name as requested")
    void updateById_shouldUpdatePathReadOnlyAndName() {
        FileUpdateRequest request = new FileUpdateRequest();
        request.setPath_id(99L);
        request.setSize("2MB");
        request.setType("pdf");
        request.setReadOnly(true);
        request.setName("report.pdf");

        when(fileRepository.findById(1L)).thenReturn(Optional.of(existingFile));
        when(fileRepository.save(existingFile)).thenReturn(existingFile);
        when(fileMapper.toResponse(existingFile)).thenReturn(new FileResponse());

        fileService.updateById(1L, request);

        assertEquals(99L, existingFile.getPath_id());
        assertThat(existingFile.getReadOnly()).isTrue();
        assertEquals("report.pdf", existingFile.getName());
        assertEquals("2MB", existingFile.getSize());
        assertEquals("pdf", existingFile.getType());
    }

    @Test
    @DisplayName("updateById should throw an exception when the file does not exist")
    void updateById_shouldThrowExceptionWhenFileNotFound() {
        when(fileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> fileService.updateById(99L, new FileUpdateRequest()));
    }

    @Test
    @DisplayName("findById should return the mapped file when found")
    void findById_shouldReturnFile() {
        FileResponse response = new FileResponse();
        when(fileRepository.findById(1L)).thenReturn(Optional.of(existingFile));
        when(fileMapper.toResponse(existingFile)).thenReturn(response);

        FileResponse result = fileService.findById(1L);

        assertThat(result).isSameAs(response);
    }

    @Test
    @DisplayName("findById should throw an exception when the file does not exist")
    void findById_shouldThrowExceptionWhenFileNotFound() {
        when(fileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> fileService.findById(99L));
    }

    @Test
    @DisplayName("findAll should return every file mapped to FileResponse")
    void findAll_shouldReturnMappedFiles() {
        FileResponse response = new FileResponse();
        when(fileRepository.findAll()).thenReturn(List.of(existingFile));
        when(fileMapper.toResponse(existingFile)).thenReturn(response);

        List<FileResponse> result = fileService.findAll();

        assertThat(result).containsExactly(response);
    }

    @Test
    @DisplayName("findAllSummary should return every file mapped to FileSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        FileSummaryResponse summary = new FileSummaryResponse();
        when(fileRepository.findAll()).thenReturn(List.of(existingFile));
        when(fileMapper.toSummaryResponse(existingFile)).thenReturn(summary);

        List<FileSummaryResponse> result = fileService.findAllSummary();

        assertThat(result).containsExactly(summary);
    }

    @Test
    @DisplayName("updateActivationById should update the file's isActive flag")
    void updateActivationById_shouldUpdateActivationStatus() {
        FileUpdateActivationRequest request = new FileUpdateActivationRequest();
        request.setIsActive(false);

        when(fileRepository.findById(1L)).thenReturn(Optional.of(existingFile));
        when(fileMapper.toResponse(existingFile)).thenReturn(new FileResponse());

        fileService.updateActivationById(1L, request);

        assertThat(existingFile.getIsActive()).isFalse();
        verify(fileRepository).save(existingFile);
    }

}