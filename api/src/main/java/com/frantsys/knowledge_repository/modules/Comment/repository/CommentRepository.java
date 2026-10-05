package com.frantsys.knowledge_repository.modules.Comment.repository;

import com.frantsys.knowledge_repository.modules.Comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    boolean existsByIdAndUserEmail(Long id, String email);

}
