package com.frantsys.knowledge_repository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
// Serializa Page como {content, page: {size, number, totalElements, totalPages}}
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class KnowledgeRepositoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(KnowledgeRepositoryApplication.class, args);
	}

}
