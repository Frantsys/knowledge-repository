package com.frantsys.knowledge_repository.modules.Material.service;

import java.time.LocalDateTime;
import java.util.List;

import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.response.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.request.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.mapper.MaterialMapper;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;
import lombok.AllArgsConstructor;

@Service 
@AllArgsConstructor 
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    private final MaterialMapper materialMapper;

    @Transactional
    public MaterialResponse createMaterial(MaterialCreateRequest request) {

        Material material = materialMapper.toEntity(request);

        material.setLikes(0);
        material.setViews(0);
        material.setUpdatedAt(null);
        material.setCreatedAt(LocalDateTime.now());
        material.setIsActive(true);

        Material savedMaterial = materialRepository.save(material);

        return materialMapper.toResponse(savedMaterial);

    }

    @Transactional(readOnly = true)
    public MaterialResponse findById(Long id) {

        Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + id));

        return materialMapper.toResponse(material);

    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> findAll() {

        return materialRepository.findAll()
            .stream()
            .map(materialMapper::toResponse)
            .toList();
        
    }

    @Transactional(readOnly = true)
    public List<MaterialSummaryResponse> findAllSummary() {

        return materialRepository.findAll()
                .stream()
                .map(materialMapper::toSummaryResponse)
                .toList();

    }

    @Transactional 
    public MaterialResponse updateById(Long id, MaterialUpdateRequest request) {

        Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + id));
        
        if(request.getTitle() != null && !request.getTitle().isBlank()) {
            material.setTitle(request.getTitle());
        }

        if(request.getBody() != null && !request.getBody().isBlank()) {
            material.setBody(request.getBody());
        }

        if(request.getSubject() != null && !request.getSubject().isBlank()) {
            material.setSubject(request.getSubject());
        }

        if(request.getCourse() != null && !request.getCourse().isBlank()) {
            material.setCourse(request.getCourse());
        }

        Material updatedMaterial = materialRepository.save(material);

        return materialMapper.toResponse(updatedMaterial);

    }

    @Transactional
    public MaterialResponse updateActivationById(Long id, MaterialUpdateActivationRequest request) {

        Material material = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + id));
        
        material.setIsActive(request.getIsActive());

        materialRepository.save(material);

        return materialMapper.toResponse(material);

    }



}
