package com.frantsys.knowledge_repository.modules.Material.repository;

import com.frantsys.knowledge_repository.modules.Material.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    boolean existsByIdAndUserEmail(Long id, String email);

}
