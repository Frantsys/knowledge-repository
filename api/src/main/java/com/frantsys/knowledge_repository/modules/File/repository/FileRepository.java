package com.frantsys.knowledge_repository.modules.File.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.frantsys.knowledge_repository.modules.File.model.File;

public interface FileRepository extends JpaRepository<File, Long> {
    
}
