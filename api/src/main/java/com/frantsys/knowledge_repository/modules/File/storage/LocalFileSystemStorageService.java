package com.frantsys.knowledge_repository.modules.File.storage;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileSystemStorageService implements StorageService {

    private final Path root;

    public LocalFileSystemStorageService(@Value("${app.storage.location}") String location) throws IOException {

        this.root = Path.of(location).toAbsolutePath().normalize();

        Files.createDirectories(root);

    }

    @Override
    public String store(MultipartFile file) {

        // A chave é gerada aqui: o nome enviado pelo cliente nunca vira caminho no disco
        String key = UUID.randomUUID().toString();

        try (InputStream in = file.getInputStream()) {

            Files.copy(in, root.resolve(key), StandardCopyOption.REPLACE_EXISTING);

            return key;

        } catch (IOException e) {
            throw new BusinessException("Não foi possível salvar o arquivo");
        }

    }

    @Override
    public Resource load(String key) {

        Path path = root.resolve(key).normalize();

        // Proteção contra path traversal (../)
        if (!path.startsWith(root)) {
            throw new BusinessException("Caminho de arquivo inválido");
        }

        Resource resource = new FileSystemResource(path);

        if (!resource.exists()) {
            throw new ResourceNotFoundException("Arquivo não encontrado no armazenamento");
        }

        return resource;

    }

    @Override
    public void delete(String key) {

        Path path = root.resolve(key).normalize();

        if (!path.startsWith(root)) {
            return;
        }

        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new BusinessException("Não foi possível remover o arquivo");
        }

    }

}
