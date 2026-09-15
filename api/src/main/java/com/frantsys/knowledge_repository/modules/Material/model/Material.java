package com.frantsys.knowledge_repository.modules.Material.model;

import java.time.LocalDateTime;

import com.frantsys.knowledge_repository.modules.User.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "materials")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class Material {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    /*
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "comments")
    private List<Comment> comments;
    */

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String body;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private String course;

    @Column(nullable = false)
    private Long likes;

    @Column(nullable = false, name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "is_active")
    private Boolean isActive;

    
}
