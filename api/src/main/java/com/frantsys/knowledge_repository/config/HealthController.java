package com.frantsys.knowledge_repository.config;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Público e sem banco: a UI chama ao abrir login/cadastro para "acordar" a API em hospedagens que hibernam
// (ex.: Render gratuito), e serve de health check do provedor
@Tag(name = "Health")
@RestController
public class HealthController {

    @Operation(summary = "Indica que a API está no ar")
    @GetMapping("/v1/api/health")
    public ResponseEntity<Void> health() {
        return ResponseEntity.noContent().build();
    }

}
