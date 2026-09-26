package com.frantsys.knowledge_repository.modules.User.service;

import com.frantsys.knowledge_repository.modules.User.dto.request.UserAddressCreateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateActivationRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdatePasswordRequest;
import com.frantsys.knowledge_repository.modules.User.dto.request.UserUpdateRequest;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserSummaryResponse;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserAddress;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("student@example.com");
        user.setFirstName("Anna");
        user.setLastName("Smith");
        user.setPassword("encoded-old-password");
    }

    private UserResponse newUserResponse() {
        return new UserResponse();
    }

    @Test
    @DisplayName("updateById should update only the fields present in the request")
    void updateById_shouldUpdateProvidedFields() {
        UserAddressCreateRequest addressRequest = new UserAddressCreateRequest();
        UserAddress addressEntity = new UserAddress();

        UserUpdateRequest request = new UserUpdateRequest();
        request.setFirstName("John");
        request.setLastname("Doe");
        request.setPhoneNumber("11999990000");
        request.setAddress(addressRequest);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toAddressEntity(addressRequest)).thenReturn(addressEntity);
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(newUserResponse());

        UserResponse response = userService.updateById(1L, request);

        assertThat(response).isNotNull();
        assertEquals("John", user.getFirstName());
        assertEquals("Doe", user.getLastName());
        assertEquals("11999990000", user.getPhoneNumber());
        assertEquals(addressEntity, user.getAddress());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("updateById should throw an exception when the user does not exist")
    void updateById_shouldThrowExceptionWhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> userService.updateById(99L, new UserUpdateRequest()));

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("findAll should return every user mapped to UserResponse")
    void findAll_shouldReturnMappedUsers() {
        User otherUser = new User();
        UserResponse response1 = newUserResponse();
        UserResponse response2 = newUserResponse();

        when(userRepository.findAll()).thenReturn(List.of(user, otherUser));
        when(userMapper.toResponse(user)).thenReturn(response1);
        when(userMapper.toResponse(otherUser)).thenReturn(response2);

        List<UserResponse> result = userService.findAll();

        assertThat(result).containsExactly(response1, response2);
    }

    @Test
    @DisplayName("findAllSummary should return every user mapped to UserSummaryResponse")
    void findAllSummary_shouldReturnMappedSummaries() {
        UserSummaryResponse summary = new UserSummaryResponse(
                1L, "Anna", "Smith", "student@example.com", UserRole.ROLE_STUDENT);

        when(userRepository.findAll()).thenReturn(List.of(user));
        when(userMapper.toSummaryResponse(user)).thenReturn(summary);

        List<UserSummaryResponse> result = userService.findAllSummary();

        assertThat(result).containsExactly(summary);
    }

    @Test
    @DisplayName("findById should return the mapped user when found")
    void findById_shouldReturnUser() {
        UserResponse response = newUserResponse();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(response);

        UserResponse result = userService.findById(1L);

        assertThat(result).isSameAs(response);
    }

    @Test
    @DisplayName("findById should throw an exception when the user does not exist")
    void findById_shouldThrowExceptionWhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.findById(99L));
    }

    @Test
    @DisplayName("updatePassword should encode and save the new password when the current one matches")
    void updatePassword_shouldUpdatePasswordWhenCurrentPasswordMatches() {
        UserUpdatePasswordRequest request = new UserUpdatePasswordRequest();
        request.setCurrentPassword("old-password");
        request.setNewPassword("new-password-123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-password", "encoded-old-password")).thenReturn(true);
        when(passwordEncoder.encode("new-password-123")).thenReturn("encoded-new-password");
        when(userRepository.save(user)).thenReturn(user);

        userService.updatePassword(1L, request);

        assertEquals("encoded-new-password", user.getPassword());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("updatePassword should throw an exception when the current password does not match")
    void updatePassword_shouldThrowExceptionWhenCurrentPasswordDoesNotMatch() {
        UserUpdatePasswordRequest request = new UserUpdatePasswordRequest();
        request.setCurrentPassword("wrong-password");
        request.setNewPassword("new-password-123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-old-password")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.updatePassword(1L, request));

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateActivationById should update the user's isActive flag")
    void updateActivationById_shouldUpdateActivationStatus() {
        UserUpdateActivationRequest request = new UserUpdateActivationRequest();
        request.setIsActive(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(newUserResponse());

        userService.updateActivationById(1L, request);

        assertThat(user.getIsActive()).isFalse();
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("loadUserByUsername should return the user when the e-mail exists")
    void loadUserByUsername_shouldReturnUserWhenFound() {
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        UserDetails result = userService.loadUserByUsername("student@example.com");

        assertThat(result).isSameAs(user);
    }

    @Test
    @DisplayName("loadUserByUsername should throw UsernameNotFoundException when the e-mail is unknown")
    void loadUserByUsername_shouldThrowExceptionWhenNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userService.loadUserByUsername("missing@example.com"));
    }

}