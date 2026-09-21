package com.frantsys.knowledge_repository.modules.File.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.File.dto.FileCreateRequest;
import com.frantsys.knowledge_repository.modules.File.dto.FileResponse;
import com.frantsys.knowledge_repository.modules.File.dto.FileUpdateRequest;
import com.frantsys.knowledge_repository.modules.File.mapper.FileMapper;
import com.frantsys.knowledge_repository.modules.File.model.File;
import com.frantsys.knowledge_repository.modules.File.repository.FileRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final FileMapper fileMapper;

    @Transactional
    public FileResponse createFile(FileCreateRequest request) {

        File file = fileMapper.toEntity(request);

        file.setCreatedAt(LocalDateTime.now());
        file.setIsActive(true);

        File savedFile = fileRepository.save(file);

        return fileMapper.toResponse(savedFile);

    }
    
    @Transactional
    public FileResponse updateFile(Long id, FileUpdateRequest request) {

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

}
