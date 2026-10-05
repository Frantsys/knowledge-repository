package com.frantsys.knowledge_repository.modules.File.repository;

import com.frantsys.knowledge_repository.modules.File.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {

    boolean existsByIdAndMaterialUserEmail(Long id, String email);

}
