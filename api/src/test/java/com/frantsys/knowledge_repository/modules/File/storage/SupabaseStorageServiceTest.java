package com.frantsys.knowledge_repository.modules.File.storage;

import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class SupabaseStorageServiceTest {

    private static final String BASE = "https://proj.supabase.co/storage/v1/object/files/";

    private MockRestServiceServer server;
    private SupabaseStorageService storage;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        storage = new SupabaseStorageService(builder, "https://proj.supabase.co/", "secret-key", "files");
    }

    @Test
    @DisplayName("store should upload bytes under a generated key with the service key")
    void store_uploadsUnderGeneratedKey() {
        server.expect(request -> assertThat(request.getURI().toString()).startsWith(BASE).doesNotContain("evil"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("Authorization", "Bearer secret-key"))
                .andExpect(content().bytes("hello".getBytes()))
                .andRespond(withSuccess());

        String key = storage.store(new MockMultipartFile("file", "../evil.pdf", "application/pdf", "hello".getBytes()));

        assertThat(key).doesNotContain("evil").doesNotContain("/");
        server.verify();
    }

    @Test
    @DisplayName("load should return the object bytes")
    void load_returnsBytes() throws IOException {
        server.expect(requestTo(BASE + "abc"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess("hello", MediaType.APPLICATION_OCTET_STREAM));

        Resource resource = storage.load("abc");

        assertThat(resource.getContentAsByteArray()).isEqualTo("hello".getBytes());
    }

    @Test
    @DisplayName("load should map Supabase's 400 not_found to ResourceNotFoundException")
    void load_missingObject_throwsNotFound() {
        server.expect(requestTo(BASE + "missing"))
                .andRespond(withStatus(HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"statusCode\":\"404\",\"error\":\"not_found\",\"message\":\"Object not found\"}"));

        assertThrows(ResourceNotFoundException.class, () -> storage.load("missing"));
    }

    @Test
    @DisplayName("delete should ignore missing objects")
    void delete_missingObject_isIgnored() {
        server.expect(requestTo(BASE + "missing"))
                .andExpect(method(HttpMethod.DELETE))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertDoesNotThrow(() -> storage.delete("missing"));
    }

}
