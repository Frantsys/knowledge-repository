package com.frantsys.knowledge_repository.modules.User.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.User.dto.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.dto.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class UserService {

    private final UserRepository repository;
    private final UserMapper mapper;
    private final PasswordEncoder encoder;

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {

        User user = mapper.toEntity(request);

        user.setPassword(encoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setRole(UserRole.ROLE_STUDENT);

        User savedUser = repository.save(user);

        return mapper.toResponse(savedUser);

    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User userToUpdate = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id)); 

        if (request.firstName() != null && !request.firstName().isBlank()) {
            userToUpdate.setFirstName(request.firstName());
        }

        if (request.lastname() != null && !request.lastname().isBlank()) {
            userToUpdate.setLastName(request.lastname());
        }

        if (request.phoneNumber() != null) {
            userToUpdate.setPhoneNumber(request.phoneNumber());
        }
        
        if (request.address() != null) {
            userToUpdate.setAddress(mapper.toAddressEntity(request.address()));
        }
        
        User updatedUser = repository.save(userToUpdate);

        return mapper.toResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> findAll() {

        return repository.findAll()
            .stream()
            .map(mapper::toSummaryResponse)
            .toList();

    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {

        User user = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        return mapper.toResponse(user);

    }

    @Transactional()
    public void updatePassword(Long id, UserUpdatePasswordRequest request) {

        User user = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não foi encontrado com ID: " +  id));

        if(!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));;

        repository.save(user);

    }

    @Transactional
    public UserResponse updateActivationById(Long id, UserUpdateActivationRequest request) {

        User user = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não foi encontrado com ID: " +  id));

        user.setIsActive(request.getIsActive());

        repository.save(user);

        return mapper.toResponse(user);

    }

    // Criar user login;
    
}
