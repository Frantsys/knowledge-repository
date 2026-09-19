package com.frantsys.knowledge_repository.modules.File.model;

import java.time.LocalDateTime;

import com.frantsys.knowledge_repository.modules.Material.model.Material;

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
@Table(name = "files")
@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
public class File {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "material_id")
    private Material material;

    @Column(nullable = false)
    private Long path_id;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, name = "read_only")
    private Boolean readOnly;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false, name = "is_active")
    private Boolean isActive;

}
