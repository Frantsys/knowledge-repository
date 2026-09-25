package com.frantsys.knowledge_repository.modules.File.service;

import java.time.LocalDateTime;
import java.util.List;

import com.frantsys.knowledge_repository.modules.File.dto.response.FileSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.File.dto.request.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.response.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.File.dto.request.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.mapper.FileMapper;
import com.frantsys.knowledge_repository.modules.File.model.File;
import com.frantsys.knowledge_repository.modules.File.repository.FileRepository;
import com.frantsys.knowledge_repository.modules.Material.model.Material;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final MaterialRepository materialRepository;
    private final FileMapper fileMapper;

    @Transactional
    public FileResponse createFile(FileCreateRequest request) {

        File file = fileMapper.toEntity(request);

        if(request.getMaterialId() != null) {
            Material materialRef = materialRepository.getReferenceById(request.getMaterialId());

            file.setMaterial(materialRef);
            file.setCreatedBy(materialRef.getCreatedBy());
        }

        file.setCreatedAt(LocalDateTime.now());
        file.setIsActive(true);

        File savedFile = fileRepository.save(file);

        return fileMapper.toResponse(savedFile);

    }
    
    @Transactional
    public FileResponse updateById(Long id, FileUpdateRequest request) {

        File file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Arquivo não encontrado com ID: " + id));

        if (request.getPath_id() != null) {
            file.setPath_id(request.getPath_id());
        }

        if (request.getSize() != null && !request.getSize().isBlank()) {
            file.setName(request.getSize());
        }

        if (request.getType() != null && !request.getType().isBlank()) {
            file.setName(request.getType());
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

    @Transactional(readOnly = true)
    public FileResponse findById(Long id) {

        File file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Arquivo não encontrado com ID: " + id));

        return fileMapper.toResponse(file);

    }

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

    @Transactional
    public FileResponse updateActivationById(Long id, FileUpdateActivationRequest request) {

        File file = fileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não foi encontrado com ID: " +  id));

        file.setIsActive(request.getIsActive());

        fileRepository.save(file);

        return fileMapper.toResponse(file);

    }

}
