package com.frantsys.knowledge_repository.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.assertj.core.api.Assertions.assertThat;

// Sobe um PostgreSQL de verdade em Docker, roda TODAS as migrações do Liquibase e depois pede ao Hibernate
// para validar (ddl-auto=validate) que as entidades batem com as tabelas criadas.
// Se uma migração estiver faltando, com caminho errado ou com tipo de coluna incompatível, este teste falha.
// Roda com "mvn verify" (maven-failsafe) e é ignorado automaticamente quando não há Docker.
@SpringBootTest(properties = "spring.jpa.hibernate.ddl-auto=validate")
@Testcontainers(disabledWithoutDocker = true)
class SchemaIT {

    @Container
    @ServiceConnection
    static PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:16");

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Liquibase migrations create every table and the entities match the schema")
    void migrationsApplyAndSchemaMatchesEntities() {
        Integer tables = jdbcTemplate.queryForObject("""
                SELECT count(*) FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name IN ('users', 'materials', 'comments', 'files')
                """, Integer.class);

        assertThat(tables).isEqualTo(4);
    }

    @Test
    @DisplayName("files.type is wide enough for long MIME types such as .docx")
    void filesTypeColumnFitsLongMimeTypes() {
        Integer maxLength = jdbcTemplate.queryForObject("""
                SELECT character_maximum_length FROM information_schema.columns
                WHERE table_name = 'files' AND column_name = 'type'
                """, Integer.class);

        assertThat(maxLength).isGreaterThanOrEqualTo(100);
    }

}
