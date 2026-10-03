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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final MaterialMapper materialMapper;

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

    @Transactional(readOnly = true)
    public MaterialResponse findById(Long id) {

        Material material = findMaterialById(id);

        return materialMapper.toResponse(material);

    }

    @Transactional
    public MaterialResponse create(String authorEmail, MaterialCreateRequest request) {

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + authorEmail));

        Material material = materialMapper.toEntity(request);

        material.setUser(author);
        material.setCreatedBy(author.getFullName());
        material.setLikes(0);
        material.setViews(0);
        material.setIsActive(true);

        Material savedMaterial = materialRepository.save(material);

        return materialMapper.toResponse(savedMaterial);

    }

    @Transactional
    public MaterialResponse updateById(Long id, MaterialUpdateRequest request) {

        Material material = findMaterialById(id);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            material.setTitle(request.getTitle());
        }

        if (request.getBody() != null && !request.getBody().isBlank()) {
            material.setBody(request.getBody());
        }

        if (request.getSubject() != null && !request.getSubject().isBlank()) {
            material.setSubject(request.getSubject());
        }

        if (request.getCourse() != null && !request.getCourse().isBlank()) {
            material.setCourse(request.getCourse());
        }

        material.setUpdatedAt(LocalDateTime.now());

        Material updatedMaterial = materialRepository.save(material);

        return materialMapper.toResponse(updatedMaterial);

    }

    @Transactional
    public MaterialResponse updateActivationById(Long id, MaterialUpdateActivationRequest request) {

        Material material = findMaterialById(id);

        material.setIsActive(request.getIsActive());

        Material updatedMaterial = materialRepository.save(material);

        return materialMapper.toResponse(updatedMaterial);

    }

    private Material findMaterialById(Long id) {

        return materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com ID: " + id));

    }

}
