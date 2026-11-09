package com.frantsys.knowledge_repository.modules.File.storage;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

// Guarda os arquivos num bucket privado do Supabase Storage via REST (usado em produção: disco do host é efêmero)
@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "supabase")
public class SupabaseStorageService implements StorageService {

    private final RestClient client;
    private final String bucket;

    @Autowired
    public SupabaseStorageService(@Value("${app.storage.supabase.url}") String url,
                                  @Value("${app.storage.supabase.key}") String serviceRoleKey,
                                  @Value("${app.storage.supabase.bucket}") String bucket) {
        this(RestClient.builder(), url, serviceRoleKey, bucket);
    }

    SupabaseStorageService(RestClient.Builder builder, String url, String serviceRoleKey, String bucket) {

        if (url.isBlank() || serviceRoleKey.isBlank()) {
            throw new IllegalStateException("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios com STORAGE_TYPE=supabase");
        }

        this.client = builder
                .baseUrl(url.replaceAll("/+$", "") + "/storage/v1/object")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .build();
        this.bucket = bucket;

    }

    @Override
    public String store(MultipartFile file) {

        // A chave é gerada aqui: o nome enviado pelo cliente nunca vira caminho no bucket
        String key = UUID.randomUUID().toString();

        String contentType = file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        try {
            client.post()
                    .uri("/{bucket}/{key}", bucket, key)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            return key;

        } catch (IOException | RestClientException e) {
            throw new BusinessException("Não foi possível salvar o arquivo");
        }

    }

    @Override
    public Resource load(String key) {

        try {
            // shortcut: carrega o arquivo inteiro em memória (limite de upload é 10MB); trocar por streaming se o limite crescer
            byte[] bytes = client.get()
                    .uri("/{bucket}/{key}", bucket, key)
                    .retrieve()
                    .body(byte[].class);

            if (bytes == null) {
                throw new ResourceNotFoundException("Arquivo não encontrado no armazenamento");
            }

            return new ByteArrayResource(bytes);

        } catch (HttpClientErrorException e) {
            if (isNotFound(e)) {
                throw new ResourceNotFoundException("Arquivo não encontrado no armazenamento");
            }
            throw new BusinessException("Não foi possível ler o arquivo");
        } catch (RestClientException e) {
            throw new BusinessException("Não foi possível ler o arquivo");
        }

    }

    @Override
    public void delete(String key) {

        try {
            client.delete()
                    .uri("/{bucket}/{key}", bucket, key)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException e) {
            if (!isNotFound(e)) {
                throw new BusinessException("Não foi possível remover o arquivo");
            }
        } catch (RestClientException e) {
            throw new BusinessException("Não foi possível remover o arquivo");
        }

    }

    // O Supabase Storage às vezes responde objeto inexistente com HTTP 400 e "not_found" no corpo
    private static boolean isNotFound(HttpClientErrorException e) {
        return e.getStatusCode().value() == 404 || e.getResponseBodyAsString().contains("not_found");
    }

}
