package com.frantsys.knowledge_repository.modules.File.repository;

import com.frantsys.knowledge_repository.modules.File.model.File;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {

    boolean existsByIdAndMaterialUserEmail(Long id, String email);


    Page<File> findByMaterialIdAndIsActiveTrue(Long materialId, Pageable pageable);

}
