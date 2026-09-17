package com.frantsys.knowledge_repository.modules.Comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.frantsys.knowledge_repository.modules.Comment.model.Comment;

public interface CommentRepository extends JpaRepository <Comment, Long>{
    
}
