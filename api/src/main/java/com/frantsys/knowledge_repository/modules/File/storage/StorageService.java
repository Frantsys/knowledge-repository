package com.frantsys.knowledge_repository.modules.File.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

// Esconde onde os bytes ficam: hoje disco local, amanhã S3, sem mexer em controllers ou services.
public interface StorageService {

    // Salva o arquivo e devolve a chave de armazenamento (guardada em File.pathId)
    String store(MultipartFile file);

    Resource load(String key);

    void delete(String key);

}
