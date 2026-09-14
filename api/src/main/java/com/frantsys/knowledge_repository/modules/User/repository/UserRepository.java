package com.frantsys.knowledge_repository.modules.User.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.frantsys.knowledge_repository.modules.User.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
}
