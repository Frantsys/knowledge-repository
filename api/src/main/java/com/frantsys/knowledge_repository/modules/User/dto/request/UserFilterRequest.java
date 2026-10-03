package com.frantsys.knowledge_repository.modules.User.dto.request;

import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

public record UserFilterRequest(
        String name,
        UserRole role,
        List<UserRole> roles,
        Boolean isActive,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
) {}
