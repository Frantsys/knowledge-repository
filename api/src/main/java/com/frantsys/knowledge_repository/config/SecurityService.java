package com.frantsys.knowledge_repository.config;

import com.frantsys.knowledge_repository.modules.Comment.repository.CommentRepository;
import com.frantsys.knowledge_repository.modules.File.repository.FileRepository;
import com.frantsys.knowledge_repository.modules.Material.repository.MaterialRepository;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

// Regras de posse usadas nas expressões do @PreAuthorize: @securityService.isMaterialOwner(#id, authentication.name)
// authentication.name é o subject do JWT, ou seja, o e-mail do usuário.
@Component("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final MaterialRepository materialRepository;
    private final CommentRepository commentRepository;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    public boolean isMaterialOwner(Long materialId, String email) {
        return materialId != null && materialRepository.existsByIdAndUserEmail(materialId, email);
    }

    public boolean isCommentOwner(Long commentId, String email) {
        return commentId != null && commentRepository.existsByIdAndUserEmail(commentId, email);
    }

    // O dono de um arquivo é o dono do material ao qual ele pertence
    public boolean isFileOwner(Long fileId, String email) {
        return fileId != null && fileRepository.existsByIdAndMaterialUserEmail(fileId, email);
    }

    public boolean isSelf(Long userId, String email) {
        return userId != null && userRepository.existsByIdAndEmail(userId, email);
    }

}
