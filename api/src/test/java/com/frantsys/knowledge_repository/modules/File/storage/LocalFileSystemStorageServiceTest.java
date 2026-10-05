package com.frantsys.knowledge_repository.modules.File.storage;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LocalFileSystemStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileSystemStorageService storage;

    @BeforeEach
    void setUp() throws IOException {
        storage = new LocalFileSystemStorageService(tempDir.toString());
    }

    @Test
    @DisplayName("store should save the bytes under a generated key and load should read them back")
    void storeAndLoad_roundTrip() throws IOException {
        MockMultipartFile upload = new MockMultipartFile("file", "../../evil.pdf", "application/pdf", "hello".getBytes());

        String key = storage.store(upload);

        // O nome enviado pelo cliente não influencia o caminho no disco
        assertThat(key).doesNotContain("evil").doesNotContain("/");

        Resource resource = storage.load(key);

        assertThat(resource.getContentAsByteArray()).isEqualTo("hello".getBytes());
    }

    @Test
    @DisplayName("load should reject keys that escape the storage directory")
    void load_pathTraversal_isRejected() {
        assertThrows(BusinessException.class, () -> storage.load("../outside.txt"));
    }

    @Test
    @DisplayName("load should throw when the key does not exist")
    void load_missingFile_throwsNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> storage.load("does-not-exist"));
    }

    @Test
    @DisplayName("delete should remove the stored file")
    void delete_removesFile() {
        String key = storage.store(new MockMultipartFile("file", "a.pdf", "application/pdf", "x".getBytes()));

        storage.delete(key);

        assertThrows(ResourceNotFoundException.class, () -> storage.load(key));
    }

}
