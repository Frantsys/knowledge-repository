package com.frantsys.knowledge_repository.modules.Material.service;

import org.springframework.stereotype.Service;

import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;

import lombok.AllArgsConstructor;

@Service 
@AllArgsConstructor 
public class MaterialService {
    
    private final MaterialRepository repository;

    

}
