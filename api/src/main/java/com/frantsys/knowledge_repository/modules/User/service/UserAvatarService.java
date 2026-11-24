package com.frantsys.knowledge_repository.modules.User.service;

import com.frantsys.knowledge_repository.exception.BusinessException;
import com.frantsys.knowledge_repository.exception.ResourceNotFoundException;
import com.frantsys.knowledge_repository.modules.File.storage.StorageService;
import com.frantsys.knowledge_repository.modules.User.dto.response.UserResponse;
import com.frantsys.knowledge_repository.modules.User.mapper.UserMapper;
import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

// Foto de perfil: guardada no mesmo StorageService dos arquivos dos materiais (disco local ou Supabase)
@Slf4j
@Service
@RequiredArgsConstructor
public class UserAvatarService {

    static final long MAX_BYTES = 5L * 1024 * 1024;

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final StorageService storageService;

    public record Avatar(Resource resource, String contentType) {
    }

    @Transactional
    public UserResponse updateAvatar(String email, MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new BusinessException("Selecione uma imagem");
        }

        if (image.getSize() > MAX_BYTES) {
            throw new BusinessException("A imagem deve ter no máximo 5 MB");
        }

        // O tipo vem dos bytes, não do Content-Type enviado pelo cliente (que pode mentir)
        String contentType = detectImageType(image);

        User user = findUser(email);
        String previousKey = user.getAvatarKey();
        String newKey = storageService.store(image);

        try {
            user.setAvatarKey(newKey);
            user.setAvatarContentType(contentType);
            userRepository.saveAndFlush(user);
        } catch (RuntimeException e) {
            // Não deixa imagem órfã no armazenamento se o registro não foi salvo
            storageService.delete(newKey);
            throw e;
        }

        deleteQuietly(previousKey);

        return userMapper.toResponse(user);

    }

    @Transactional
    public UserResponse removeAvatar(String email) {

        User user = findUser(email);
        String previousKey = user.getAvatarKey();

        user.setAvatarKey(null);
        user.setAvatarContentType(null);
        userRepository.saveAndFlush(user);

        deleteQuietly(previousKey);

        return userMapper.toResponse(user);

    }

    // Só serve chaves registradas como foto de algum usuário: o endpoint público não vira atalho para baixar arquivos de materiais
    @Transactional(readOnly = true)
    public Avatar loadAvatar(String avatarKey) {

        User user = userRepository.findByAvatarKey(avatarKey)
                .orElseThrow(() -> new ResourceNotFoundException("Foto não encontrada"));

        return new Avatar(storageService.load(avatarKey), user.getAvatarContentType());

    }

    static String detectImageType(MultipartFile image) {

        byte[] head;

        try (InputStream in = image.getInputStream()) {
            head = in.readNBytes(12);
        } catch (IOException e) {
            throw new BusinessException("Não foi possível ler a imagem");
        }

        if (startsWith(head, 0, 0xFF, 0xD8, 0xFF)) {
            return "image/jpeg";
        }

        if (startsWith(head, 0, 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A)) {
            return "image/png";
        }

        if (startsWith(head, 0, 'R', 'I', 'F', 'F') && startsWith(head, 8, 'W', 'E', 'B', 'P')) {
            return "image/webp";
        }

        throw new BusinessException("Formato de imagem não suportado. Envie JPG, PNG ou WEBP.");

    }

    private static boolean startsWith(byte[] data, int offset, int... expected) {

        if (data.length < offset + expected.length) {
            return false;
        }

        for (int i = 0; i < expected.length; i++) {
            if ((data[offset + i] & 0xFF) != expected[i]) {
                return false;
            }
        }

        return true;

    }

    // A foto antiga já saiu do registro: se a remoção do arquivo falhar, só fica um órfão no armazenamento
    private void deleteQuietly(String key) {

        if (key == null) {
            return;
        }

        try {
            storageService.delete(key);
        } catch (RuntimeException e) {
            log.warn("Não foi possível remover a foto antiga {} do armazenamento", key, e);
        }

    }

    private User findUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + email));

    }

}
