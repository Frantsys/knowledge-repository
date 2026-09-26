package com.frantsys.knowledge_repository.modules.Material.service;

import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import com.frantsys.knowledge_repository.modules.Material.mapper.MaterialMapper;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MaterialServiceTest {

    @Mock
    private MaterialRepository materialRepository;

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
    @DisplayName("createMaterial should set default counters and activate the material")
    void createMaterial_shouldSetDefaultsAndSave() {
        MaterialCreateRequest request = new MaterialCreateRequest();
        request.setTitle("Intro to Testing");

        Material mappedMaterial = new Material();
        when(materialMapper.toEntity(request)).thenReturn(mappedMaterial);
        when(materialRepository.save(mappedMaterial)).thenReturn(mappedMaterial);
        when(materialMapper.toResponse(mappedMaterial)).thenReturn(new MaterialResponse());

        materialService.createMaterial(request);

        assertEquals(0, mappedMaterial.getLikes());
        assertEquals(0, mappedMaterial.getViews());
        assertThat(mappedMaterial.getIsActive()).isTrue();
        assertThat(mappedMaterial.getCreatedAt()).isNotNull();
        assertThat(mappedMaterial.getUpdatedAt()).isNull();
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

        assertThrows(RuntimeException.class, () -> materialService.findById(99L));
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
    @DisplayName("updateById should update only the fields present in the request")
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
        verify(materialRepository).save(existingMaterial);
    }

    @Test
    @DisplayName("updateById should throw an exception when the material does not exist")
    void updateById_shouldThrowExceptionWhenNotFound() {
        when(materialRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> materialService.updateById(99L, new MaterialUpdateRequest()));
    }

    @Test
    @DisplayName("updateActivationById should update the material's isActive flag")
    void updateActivationById_shouldUpdateActivationStatus() {
        MaterialUpdateActivationRequest request = new MaterialUpdateActivationRequest();
        request.setIsActive(false);

        when(materialRepository.findById(1L)).thenReturn(Optional.of(existingMaterial));
        when(materialMapper.toResponse(existingMaterial)).thenReturn(new MaterialResponse());

        materialService.updateActivationById(1L, request);

        assertThat(existingMaterial.getIsActive()).isFalse();
        verify(materialRepository).save(existingMaterial);
    }

}