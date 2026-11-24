package com.frantsys.knowledge_repository.modules.Comment.repository;

import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    boolean existsByIdAndUserEmail(Long id, String email);


    // CommentResponse traz a foto do autor (user.avatarKey): o EntityGraph busca o autor no mesmo JOIN, evitando N+1
    @Override
    @EntityGraph(attributePaths = "user")
    Page<Comment> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "user")
    Page<Comment> findByMaterialIdAndIsActiveTrue(Long materialId, Pageable pageable);

}
