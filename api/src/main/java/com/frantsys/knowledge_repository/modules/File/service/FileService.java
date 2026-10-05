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
import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.modules.File.storage.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final FileMapper fileMapper;
    private final StorageService storageService;

    // Tipos aceitos no upload
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
            "image/png",
            "image/jpeg",
            "application/zip");

    @Transactional(readOnly = true)
    public Page<FileResponse> findAll(Pageable pageable) {

        return fileRepository.findAll(pageable)
                .map(fileMapper::toResponse);

    }

    @Transactional(readOnly = true)
    public Page<FileSummaryResponse> findAllSummary(Pageable pageable) {

        return fileRepository.findAll(pageable)
                .map(fileMapper::toSummaryResponse);

    }

    @Transactional(readOnly = true)
    public FileResponse findById(Long id) {

        File file = findFileById(id);

        return fileMapper.toResponse(file);

    }

    @Transactional
    public FileResponse create(String authorEmail, FileCreateRequest request, MultipartFile upload) {

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + authorEmail));

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material não encontrado com ID: " + request.getMaterialId()));

        if (upload == null || upload.isEmpty()) {
            throw new BusinessException("Arquivo é obrigatório");
        }

        if (upload.getContentType() == null || !ALLOWED_TYPES.contains(upload.getContentType())) {
            throw new BusinessException("Tipo de arquivo não permitido: " + upload.getContentType());
        }

        File file = fileMapper.toEntity(request);

        String name = request.getName();

        if (name == null || name.isBlank()) {
            name = upload.getOriginalFilename() != null ? upload.getOriginalFilename() : "arquivo";
        }

        String storageKey = storageService.store(upload);

        try {

            file.setMaterial(material);
            file.setName(name);
            file.setPathId(storageKey);
            file.setSize(String.valueOf(upload.getSize()));
            file.setType(upload.getContentType());
            file.setCreatedBy(author.getFullName());
            file.setIsActive(true);

            File savedFile = fileRepository.saveAndFlush(file);

            return fileMapper.toResponse(savedFile);

        } catch (RuntimeException e) {
            // Não deixa arquivo órfão no disco se o registro não foi salvo
            storageService.delete(storageKey);
            throw e;
        }

    }

    @Transactional(readOnly = true)
    public File findEntityById(Long id) {

        return findFileById(id);

    }

    @Transactional
    public FileResponse updateById(Long id, FileUpdateRequest request) {

        File file = findFileById(id);

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
