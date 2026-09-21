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
    public MaterialResponse createMaterial(MaterialCreateRequest request) {

        Material material = materialMapper.toEntity(request);

        if(request.getUserId() != null) {
            User userRef = userRepository.getReferenceById(request.getUserId());
            String userFullname = userRef.getFirstName() + userRef.getLastName();

            material.setUser(userRef);
            material.setCreatedBy(userFullname);
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



}
