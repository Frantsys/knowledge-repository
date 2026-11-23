package com.frantsys.knowledge_repository.modules.File.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Optional;

// Esconde onde os bytes ficam: hoje disco local, amanhã S3, sem mexer em controllers ou services.
public interface StorageService {

    // Salva o arquivo e devolve a chave de armazenamento (guardada em File.pathId)
    String store(MultipartFile file);

    Resource load(String key);

    // URL temporária para o cliente baixar direto do armazenamento, sem os bytes passarem pela API.
    // Vazio = o armazenamento não suporta; o controller cai no load().
    default Optional<URI> signedDownloadUrl(String key, String filename) {
        return Optional.empty();
    }

    void delete(String key);

}
