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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final FileMapper fileMapper;

    @Transactional(readOnly = true)
    public List<FileResponse> findAll() {

        return fileRepository.findAll()
                .stream()
                .map(fileMapper::toResponse)
                .toList();

    }

    @Transactional(readOnly = true)
    public List<FileSummaryResponse> findAllSummary() {

        return fileRepository.findAll()
                .stream()
                .map(fileMapper::toSummaryResponse)
                .toList();

    }

    @Transactional(readOnly = true)
    public FileResponse findById(Long id) {

        File file = findFileById(id);

        return fileMapper.toResponse(file);

    }

    @Transactional
    public FileResponse create(String authorEmail, FileCreateRequest request) {

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + authorEmail));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com ID: " + request.getMaterialId()));

        File file = fileMapper.toEntity(request);

        file.setMaterial(material);
        file.setCreatedBy(author.getFullName());
        file.setIsActive(true);

        File savedFile = fileRepository.save(file);

        return fileMapper.toResponse(savedFile);

    }

    @Transactional
    public FileResponse updateById(Long id, FileUpdateRequest request) {

        File file = findFileById(id);

        if (request.getPathId() != null) {
            file.setPathId(request.getPathId());
        }

        if (request.getSize() != null && !request.getSize().isBlank()) {
            file.setSize(request.getSize());
        }

        if (request.getType() != null && !request.getType().isBlank()) {
            file.setType(request.getType());
        }

        if (request.getReadOnly() != null) {
            file.setReadOnly(request.getReadOnly());
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            file.setName(request.getName());
        }

        File updatedFile = fileRepository.save(file);

        return fileMapper.toResponse(updatedFile);

    }

    @Transactional
    public FileResponse updateActivationById(Long id, FileUpdateActivationRequest request) {

        File file = findFileById(id);

        file.setIsActive(request.getIsActive());

        File updatedFile = fileRepository.save(file);

        return fileMapper.toResponse(updatedFile);

    }

    private File findFileById(Long id) {

        return fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arquivo não encontrado com ID: " + id));

    }

}
