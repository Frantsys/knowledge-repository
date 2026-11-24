package com.frantsys.knowledge_repository.modules.User.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.File.storage.StorageService;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserAvatarServiceTest {

    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0x0D};
    private static final byte[] JPEG = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0x10};
    private static final byte[] WEBP = {'R', 'I', 'F', 'F', 0x24, 0, 0, 0, 'W', 'E', 'B', 'P'};

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private StorageService storageService;

    @InjectMocks
    private UserAvatarService avatarService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("student@example.com");
    }

    private static MockMultipartFile image(byte[] bytes, String declaredType) {
        return new MockMultipartFile("file", "foto", declaredType, bytes);
    }

    @Test
    @DisplayName("updateAvatar should store a PNG, save its key and type, and delete the previous photo")
    void updateAvatar_storesNewAndDeletesPrevious() {
        user.setAvatarKey("old-key");
        UserResponse response = new UserResponse();
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(storageService.store(any())).thenReturn("new-key");
        when(userMapper.toResponse(user)).thenReturn(response);

        UserResponse result = avatarService.updateAvatar("student@example.com", image(PNG, "image/png"));

        assertThat(result).isSameAs(response);
        assertThat(user.getAvatarKey()).isEqualTo("new-key");
        assertThat(user.getAvatarContentType()).isEqualTo("image/png");
        verify(userRepository).saveAndFlush(user);
        verify(storageService).delete("old-key");
    }

    @Test
    @DisplayName("updateAvatar should detect the type from the bytes, not from the declared Content-Type")
    void updateAvatar_rejectsFakeImage() {
        // HTML disfarçado de PNG: o Content-Type declarado não basta
        MockMultipartFile fake = image("<html><script>".getBytes(), "image/png");

        assertThrows(BusinessException.class, () -> avatarService.updateAvatar("student@example.com", fake));

        verify(storageService, never()).store(any());
    }

    @Test
    @DisplayName("updateAvatar should reject images larger than 5 MB before storing")
    void updateAvatar_rejectsTooLarge() {
        byte[] big = new byte[(int) UserAvatarService.MAX_BYTES + 1];
        System.arraycopy(PNG, 0, big, 0, PNG.length);

        assertThrows(BusinessException.class, () -> avatarService.updateAvatar("student@example.com", image(big, "image/png")));

        verify(storageService, never()).store(any());
    }

    @Test
    @DisplayName("updateAvatar should delete the new file when saving the user fails, keeping the previous photo")
    void updateAvatar_rollsBackStoredFileOnSaveFailure() {
        user.setAvatarKey("old-key");
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(storageService.store(any())).thenReturn("new-key");
        doThrow(new RuntimeException("db down")).when(userRepository).saveAndFlush(user);

        assertThrows(RuntimeException.class, () -> avatarService.updateAvatar("student@example.com", image(JPEG, "image/jpeg")));

        verify(storageService).delete("new-key");
        verify(storageService, never()).delete("old-key");
    }

    @Test
    @DisplayName("updateAvatar should still succeed when deleting the previous photo fails")
    void updateAvatar_ignoresFailureDeletingPrevious() {
        user.setAvatarKey("old-key");
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));
        when(storageService.store(any())).thenReturn("new-key");
        doThrow(new BusinessException("disk")).when(storageService).delete("old-key");

        avatarService.updateAvatar("student@example.com", image(WEBP, "image/webp"));

        assertThat(user.getAvatarKey()).isEqualTo("new-key");
        assertThat(user.getAvatarContentType()).isEqualTo("image/webp");
    }

    @Test
    @DisplayName("removeAvatar should clear the photo and delete it from storage")
    void removeAvatar_clearsAndDeletes() {
        user.setAvatarKey("old-key");
        user.setAvatarContentType("image/png");
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(user));

        avatarService.removeAvatar("student@example.com");

        assertThat(user.getAvatarKey()).isNull();
        assertThat(user.getAvatarContentType()).isNull();
        verify(userRepository).saveAndFlush(user);
        verify(storageService).delete("old-key");
    }

    @Test
    @DisplayName("loadAvatar should only serve keys registered as a user's photo")
    void loadAvatar_unknownKey_throwsNotFound() {
        when(userRepository.findByAvatarKey("material-file-key")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> avatarService.loadAvatar("material-file-key"));

        verify(storageService, never()).load(any());
    }

    @Test
    @DisplayName("loadAvatar should return the stored image with its content type")
    void loadAvatar_returnsResourceAndType() {
        user.setAvatarKey("k");
        user.setAvatarContentType("image/jpeg");
        ByteArrayResource resource = new ByteArrayResource(JPEG);
        when(userRepository.findByAvatarKey("k")).thenReturn(Optional.of(user));
        when(storageService.load("k")).thenReturn(resource);

        UserAvatarService.Avatar avatar = avatarService.loadAvatar("k");

        assertThat(avatar.resource()).isSameAs(resource);
        assertThat(avatar.contentType()).isEqualTo("image/jpeg");
    }

}
