package com.frantsys.knowledge_repository.modules.User.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserLoginRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor  
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {

        User user = userMapper.toEntity(request);

        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        user.setCreatedAt(LocalDateTime.now());
        user.setIsActive(true);
        user.setRole(UserRole.ROLE_STUDENT);
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);

    }

    @Transactional
    public UserResponse updateById(Long id, UserUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id)); 

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastname() != null && !request.getLastname().isBlank()) {
            user.setLastName(request.getLastname());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        if (request.getAddress() != null) {
            user.setAddress(userMapper.toAddressEntity(request.getAddress()));
        }
        
        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
        
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {

        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();

    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> findAllSummary() {

        return userRepository.findAll()
            .stream()
            .map(userMapper::toSummaryResponse)
            .toList();

    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {

        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        return userMapper.toResponse(user);

    }

    @Transactional()
    public void updatePassword(Long id, UserUpdatePasswordRequest request) {

        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não foi encontrado com ID: " +  id));

        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

    }

    @Transactional
    public UserResponse updateActivationById(Long id, UserUpdateActivationRequest request) {

        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não foi encontrado com ID: " +  id));

        user.setIsActive(request.getIsActive());

        userRepository.save(user);

        return userMapper.toResponse(user);

    }

    // Lógica de Login temporária sem JWT
    @Transactional 
    public String login(UserLoginRequest request) {
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Credenciais inválidas."));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciais inválidas.");
        }

        return "TOKEN_DE_AUTENTICACAO";

    }

    
}
