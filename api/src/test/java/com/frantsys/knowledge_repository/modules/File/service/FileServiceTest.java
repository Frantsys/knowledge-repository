package com.frantsys.knowledge_repository.modules.File.service;

import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
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
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
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
    private UserRepository userRepository;

    @Mock
    private FileMapper fileMapper;

    @InjectMocks
    private FileService fileService;

    private File existingFile;

    @BeforeEach
    void setUp() {
        existingFile = new File();
        existingFile.setPathId(1L);
        existingFile.setSize("10KB");
        existingFile.setType("pdf");
        existingFile.setReadOnly(false);
        existingFile.setName("old-name.pdf");
    }

    @Test
    @DisplayName("create should link the material, set the author as creator and activate the file")
    void create_shouldLinkMaterialAndSetDefaults() {
        User author = new User();
        author.setFirstName("Anna");
        author.setLastName("Smith");

        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(10L);

        Material material = new Material();
        File mappedFile = new File();
        FileResponse response = new FileResponse();

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(materialRepository.findById(10L)).thenReturn(Optional.of(material));
        when(fileMapper.toEntity(request)).thenReturn(mappedFile);
        when(fileRepository.save(mappedFile)).thenReturn(mappedFile);
        when(fileMapper.toResponse(mappedFile)).thenReturn(response);

        FileResponse result = fileService.create("anna@example.com", request);

        assertThat(result).isSameAs(response);
        assertThat(mappedFile.getMaterial()).isSameAs(material);
        assertEquals("Anna Smith", mappedFile.getCreatedBy());
        assertThat(mappedFile.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("create should throw an exception when the material does not exist")
    void create_shouldThrowExceptionWhenMaterialNotFound() {
        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(99L);

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(new User()));
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> fileService.create("anna@example.com", request));

        verify(fileRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateById should update pathId, readOnly and name as requested")
    void updateById_shouldUpdateProvidedFields() {
        FileUpdateRequest request = new FileUpdateRequest();
        request.setPathId(2L);
        request.setReadOnly(true);
        request.setName("new-name.pdf");

        when(fileRepository.findById(1L)).thenReturn(Optional.of(existingFile));
        when(fileRepository.save(existingFile)).thenReturn(existingFile);
        when(fileMapper.toResponse(existingFile)).thenReturn(new FileResponse());

        fileService.updateById(1L, request);

        assertEquals(2L, existingFile.getPathId());
        assertThat(existingFile.getReadOnly()).isTrue();
        assertEquals("new-name.pdf", existingFile.getName());
        assertEquals("10KB", existingFile.getSize());
        assertEquals("pdf", existingFile.getType());
        verify(fileRepository).save(existingFile);
    }

    @Test
    @DisplayName("updateById should throw an exception when the file does not exist")
    void updateById_shouldThrowExceptionWhenNotFound() {
        when(fileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
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
    void findById_shouldThrowExceptionWhenNotFound() {
        when(fileRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> fileService.findById(99L));
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
        when(fileRepository.save(existingFile)).thenReturn(existingFile);
        when(fileMapper.toResponse(existingFile)).thenReturn(new FileResponse());

        fileService.updateActivationById(1L, request);

        assertThat(existingFile.getIsActive()).isFalse();
        verify(fileRepository).save(existingFile);
    }

}
