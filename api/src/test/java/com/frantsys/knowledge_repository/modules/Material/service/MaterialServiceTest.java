package com.frantsys.knowledge_repository.modules.Material.service;

import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import com.frantsys.knowledge_repository.modules.Material.mapper.MaterialMapper;
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
class MaterialServiceTest {

    @Mock
    private MaterialRepository materialRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MaterialMapper materialMapper;

    @InjectMocks
    private MaterialService materialService;

    private Material existingMaterial;

    @BeforeEach
    void setUp() {
        existingMaterial = new Material();
        existingMaterial.setTitle("Old title");
        existingMaterial.setBody("Old body");
        existingMaterial.setSubject("Old subject");
        existingMaterial.setCourse("Old course");
    }

    @Test
    @DisplayName("create should link the author, set default counters and activate the material")
    void create_shouldSetAuthorAndDefaults() {
        User author = new User();
        author.setFirstName("Anna");
        author.setLastName("Smith");

        MaterialCreateRequest request = new MaterialCreateRequest();
        request.setTitle("Intro to Testing");

        Material mappedMaterial = new Material();
        when(userRepository.findByEmail("anna@example.com")).thenReturn(Optional.of(author));
        when(materialMapper.toEntity(request)).thenReturn(mappedMaterial);
        when(materialRepository.save(mappedMaterial)).thenReturn(mappedMaterial);
        when(materialMapper.toResponse(mappedMaterial)).thenReturn(new MaterialResponse());

        materialService.create("anna@example.com", request);

        assertThat(mappedMaterial.getUser()).isSameAs(author);
        assertEquals("Anna Smith", mappedMaterial.getCreatedBy());
        assertEquals(0, mappedMaterial.getLikes());
        assertEquals(0, mappedMaterial.getViews());
        assertThat(mappedMaterial.getIsActive()).isTrue();
        assertThat(mappedMaterial.getUpdatedAt()).isNull();
    }

    @Test
    @DisplayName("create should throw an exception when the author does not exist")
    void create_shouldThrowExceptionWhenAuthorNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> materialService.create("missing@example.com", new MaterialCreateRequest()));

        verify(materialRepository, never()).save(any());
    }

    @Test
    @DisplayName("findById should return the mapped material when found")
    void findById_shouldReturnMaterial() {
        MaterialResponse response = new MaterialResponse();
        when(materialRepository.findById(1L)).thenReturn(Optional.of(existingMaterial));
        when(materialMapper.toResponse(existingMaterial)).thenReturn(response);

        MaterialResponse result = materialService.findById(1L);

        assertThat(result).isSameAs(response);
    }

    @Test
    @DisplayName("findById should throw an exception when the material does not exist")
    void findById_shouldThrowExceptionWhenNotFound() {
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materialService.findById(99L));
    }

    @Test
    @DisplayName("findAll should return every material mapped to MaterialResponse")
    void findAll_shouldReturnMappedMaterials() {
        MaterialResponse response = new MaterialResponse();
        when(materialRepository.findAll()).thenReturn(List.of(existingMaterial));
        when(materialMapper.toResponse(existingMaterial)).thenReturn(response);

        List<MaterialResponse> result = materialService.findAll();

        assertThat(result).containsExactly(response);
    }

    @Test
    @DisplayName("findAllSummary should return every material mapped to MaterialSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        MaterialSummaryResponse summary = new MaterialSummaryResponse();
        when(materialRepository.findAll()).thenReturn(List.of(existingMaterial));
        when(materialMapper.toSummaryResponse(existingMaterial)).thenReturn(summary);

        List<MaterialSummaryResponse> result = materialService.findAllSummary();

        assertThat(result).containsExactly(summary);
    }

    @Test
    @DisplayName("updateById should update only the fields present in the request and set updatedAt")
    void updateById_shouldUpdateProvidedFields() {
        MaterialUpdateRequest request = new MaterialUpdateRequest();
        request.setTitle("New title");

        when(materialRepository.findById(1L)).thenReturn(Optional.of(existingMaterial));
        when(materialRepository.save(existingMaterial)).thenReturn(existingMaterial);
        when(materialMapper.toResponse(existingMaterial)).thenReturn(new MaterialResponse());

        materialService.updateById(1L, request);

        assertEquals("New title", existingMaterial.getTitle());
        assertEquals("Old body", existingMaterial.getBody());
        assertEquals("Old subject", existingMaterial.getSubject());
        assertEquals("Old course", existingMaterial.getCourse());
        assertThat(existingMaterial.getUpdatedAt()).isNotNull();
        verify(materialRepository).save(existingMaterial);
    }

    @Test
    @DisplayName("updateById should throw an exception when the material does not exist")
    void updateById_shouldThrowExceptionWhenNotFound() {
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> materialService.updateById(99L, new MaterialUpdateRequest()));
    }

    @Test
    @DisplayName("updateActivationById should update the material's isActive flag")
    void updateActivationById_shouldUpdateActivationStatus() {
        MaterialUpdateActivationRequest request = new MaterialUpdateActivationRequest();
        request.setIsActive(false);

        when(materialRepository.findById(1L)).thenReturn(Optional.of(existingMaterial));
        when(materialRepository.save(existingMaterial)).thenReturn(existingMaterial);
        when(materialMapper.toResponse(existingMaterial)).thenReturn(new MaterialResponse());

        materialService.updateActivationById(1L, request);

        assertThat(existingMaterial.getIsActive()).isFalse();
        verify(materialRepository).save(existingMaterial);
    }

}
