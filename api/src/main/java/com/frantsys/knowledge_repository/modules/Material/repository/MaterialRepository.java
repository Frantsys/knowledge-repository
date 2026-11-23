package com.frantsys.knowledge_repository.modules.Material.repository;

import com.frantsys.knowledge_repository.modules.Material.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// MaterialResponse traz o autor (user): o EntityGraph busca tudo num JOIN, evitando 1 query extra por material (N+1)
public interface MaterialRepository extends JpaRepository<Material, Long> {

    boolean existsByIdAndUserEmail(Long id, String email);

    @Override
    @EntityGraph(attributePaths = "user")
    Page<Material> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "user")
    Optional<Material> findById(Long id);

    @EntityGraph(attributePaths = "user")
    Page<Material> findByUserEmailAndIsActiveTrue(String email, Pageable pageable);

}
