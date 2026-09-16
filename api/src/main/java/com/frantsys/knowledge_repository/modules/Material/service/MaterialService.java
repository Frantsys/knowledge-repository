package com.frantsys.knowledge_repository.modules.Material.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.Material.dto.MaterialCreateRequest;
import com.frantsys.knowledge_repository.modules.Material.dto.MaterialResponse;
import com.frantsys.knowledge_repository.modules.Material.dto.MaterialUpdateRequest;
import com.frantsys.knowledge_repository.modules.Material.mapper.MaterialMapper;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;

import com.frantsys.knowledge_repository.modules.User.model.User; 

import lombok.AllArgsConstructor;

@Service 
@AllArgsConstructor 
public class MaterialService {
    
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final MaterialMapper materialMapper;

    @Transactional
    public MaterialResponse create(MaterialCreateRequest request) {

        Material material = materialMapper.toEntity(request);

        if(request.getUserId() != null) {
            User userRef = userRepository.getReferenceById(request.getUserId());
            material.setUser(userRef);
        }
        
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

    @Transactional 
    public MaterialResponse updateById(Long id, MaterialUpdateRequest request) {

        Material materialToUpdate = materialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material não encontrado com ID: " + id));
        
        if(request.getTitle() != null && !request.getTitle().isBlank()) {
            materialToUpdate.setTitle(request.getTitle());
        }

        if(request.getBody() != null && !request.getBody().isBlank()) {
            materialToUpdate.setBody(request.getBody());
        }

        if(request.getSubject() != null && !request.getSubject().isBlank()) {
            materialToUpdate.setSubject(request.getSubject());
        }

        if(request.getCourse() != null && !request.getCourse().isBlank()) {
            materialToUpdate.setCourse(request.getCourse());
        }

        Material updatedMaterial = materialRepository.save(materialToUpdate);

        return materialMapper.toResponse(updatedMaterial);

    }



}
