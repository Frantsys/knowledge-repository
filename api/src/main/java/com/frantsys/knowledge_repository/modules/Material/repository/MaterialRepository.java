package com.frantsys.knowledge_repository.modules.Material.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.frantsys.knowledge_repository.modules.Material.model.Material;

public interface MaterialRepository extends JpaRepository<Long, Material>{
   
}
