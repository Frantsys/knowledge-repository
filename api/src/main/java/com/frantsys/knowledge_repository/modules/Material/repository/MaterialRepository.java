package com.frantsys.knowledge_repository.modules.Material.repository;

import com.frantsys.knowledge_repository.modules.Material.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    boolean existsByIdAndUserEmail(Long id, String email);


    Page<Material> findByUserEmailAndIsActiveTrue(String email, Pageable pageable);

}
