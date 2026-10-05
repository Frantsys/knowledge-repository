package com.frantsys.knowledge_repository.modules.File.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.File.storage.StorageService;
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
import org.springframework.mock.web.MockMultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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

    @Mock
    private StorageService storageService;

    @InjectMocks
    private FileService fileService;

    private File existingFile;

    @BeforeEach
    void setUp() {
        existingFile = new File();
        existingFile.setPathId("key-1");
        existingFile.setSize("10KB");
        existingFile.setType("pdf");
        existingFile.setReadOnly(false);
        existingFile.setName("old-name.pdf");
    }

    private MockMultipartFile pdfUpload() {
        return new MockMultipartFile("file", "notes.pdf", "application/pdf", "content".getBytes());
    }

    @Test
    @DisplayName("create should store the upload, fill size/type/pathId from it and activate the file")
    void create_shouldStoreUploadAndSetDefaults() {
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
        when(storageService.store(any())).thenReturn("generated-key");
        when(fileRepository.saveAndFlush(mappedFile)).thenReturn(mappedFile);
        when(fileMapper.toResponse(mappedFile)).thenReturn(response);

        FileResponse result = fileService.create("anna@example.com", request, pdfUpload());

        assertThat(result).isSameAs(response);
        assertThat(mappedFile.getMaterial()).isSameAs(material);
        assertEquals("Anna Smith", mappedFile.getCreatedBy());
        assertEquals("generated-key", mappedFile.getPathId());
        assertEquals("7", mappedFile.getSize());
        assertEquals("application/pdf", mappedFile.getType());
        assertEquals("notes.pdf", mappedFile.getName());
        assertThat(mappedFile.getIsActive()).isTrue();
    }

    @Test
    @DisplayName("create should remove the stored file when saving the metadata fails")
    void create_shouldDeleteStoredFileWhenSaveFails() {
        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(10L);

        File mappedFile = new File();

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(new User()));
        when(materialRepository.findById(10L)).thenReturn(Optional.of(new Material()));
        when(fileMapper.toEntity(request)).thenReturn(mappedFile);
        when(storageService.store(any())).thenReturn("generated-key");
        when(fileRepository.saveAndFlush(mappedFile)).thenThrow(new IllegalStateException("db down"));

        assertThrows(IllegalStateException.class,
                () -> fileService.create("anna@example.com", request, pdfUpload()));

        verify(storageService).delete("generated-key");
    }

    @Test
    @DisplayName("create should reject content types that are not allowed")
    void create_shouldRejectDisallowedContentType() {
        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(10L);

        MockMultipartFile exe = new MockMultipartFile("file", "x.exe", "application/x-msdownload", "x".getBytes());

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(new User()));
        when(materialRepository.findById(10L)).thenReturn(Optional.of(new Material()));

        assertThrows(BusinessException.class,
                () -> fileService.create("anna@example.com", request, exe));

        verify(storageService, never()).store(any());
    }

    @Test
    @DisplayName("create should throw an exception when the material does not exist")
    void create_shouldThrowExceptionWhenMaterialNotFound() {
        FileCreateRequest request = new FileCreateRequest();
        request.setMaterialId(99L);

        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(new User()));
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> fileService.create("anna@example.com", request, pdfUpload()));

        verify(fileRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("updateById should update readOnly and name and never touch the storage key")
    void updateById_shouldUpdateProvidedFields() {
        FileUpdateRequest request = new FileUpdateRequest();
                request.setReadOnly(true);
        request.setName("new-name.pdf");

        when(fileRepository.findById(1L)).thenReturn(Optional.of(existingFile));
        when(fileRepository.save(existingFile)).thenReturn(existingFile);
        when(fileMapper.toResponse(existingFile)).thenReturn(new FileResponse());

        fileService.updateById(1L, request);

        assertEquals("key-1", existingFile.getPathId());
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
        when(fileRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(existingFile)));
        when(fileMapper.toResponse(existingFile)).thenReturn(response);

        Page<FileResponse> result = fileService.findAll(PageRequest.of(0, 10));

        assertThat(result.getContent()).containsExactly(response);
    }

    @Test
    @DisplayName("findAllSummary should return every file mapped to FileSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        FileSummaryResponse summary = new FileSummaryResponse();
        when(fileRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(List.of(existingFile)));
        when(fileMapper.toSummaryResponse(existingFile)).thenReturn(summary);

        Page<FileSummaryResponse> result = fileService.findAllSummary(PageRequest.of(0, 10));

        assertThat(result.getContent()).containsExactly(summary);
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
