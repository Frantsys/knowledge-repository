package com.frantsys.knowledge_repository.modules.User.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserFilterRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import com.frantsys.knowledge_repository.modules.User.spec.UserSpec;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

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

        User user = findUserById(id);

        return userMapper.toResponse(user);

    }

    @Transactional(readOnly = true)
    public List<UserResponse> filter(UserFilterRequest filter) {

        Specification<User> spec = Specification.unrestricted();

        if (filter.name() != null && !filter.name().isBlank()) {
            spec = spec.and(UserSpec.byName(filter.name()));
        }

        if (filter.role() != null) {
            spec = spec.and(UserSpec.byRole(filter.role()));
        }

        if (filter.roles() != null && !filter.roles().isEmpty()) {
            spec = spec.and(UserSpec.byRoles(filter.roles()));
        }

        if (filter.isActive() != null) {
            spec = spec.and(UserSpec.byActivation(filter.isActive()));
        }

        if (filter.startDate() != null && filter.endDate() != null) {
            spec = spec.and(UserSpec.byCreatedBetween(filter.startDate(), filter.endDate()));
        } else if (filter.startDate() != null) {
            spec = spec.and(UserSpec.byCreatedAfter(filter.startDate()));
        } else if (filter.endDate() != null) {
            spec = spec.and(UserSpec.byCreatedBefore(filter.endDate()));
        }

        return userRepository.findAll(spec)
                .stream()
                .map(userMapper::toResponse)
                .toList();

    }

    @Transactional
    public UserResponse updateById(Long id, UserUpdateRequest request) {

        User user = findUserById(id);

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getCourse() != null && !request.getCourse().isBlank()) {
            user.setCourse(request.getCourse());
        }

        if (request.getAddress() != null) {
            user.setAddress(userMapper.toAddressEntity(request.getAddress()));
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);

    }

    @Transactional
    public UserResponse updateActivationById(Long id, UserUpdateActivationRequest request) {

        User user = findUserById(id);

        user.setIsActive(request.getIsActive());

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);

    }

    @Transactional
    public void updatePassword(String email, UserUpdatePasswordRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException("Senha atual incorreta");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {

        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

    }

    private User findUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));

    }

}
