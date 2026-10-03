package com.frantsys.knowledge_repository.modules.User.spec;

import com.frantsys.knowledge_repository.modules.User.model.User;
import com.frantsys.knowledge_repository.modules.User.model.UserRole;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class UserSpec {

    private UserSpec() {
    }

    // Busca parcial, sem diferenciar maiúsculas, no nome completo (nome + sobrenome)
    public static Specification<User> byName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isBlank()) return cb.conjunction();

            String pattern = "%" + name.trim().toLowerCase() + "%";

            var fullName = cb.concat(
                    cb.concat(cb.lower(root.<String>get("firstName")), " "),
                    cb.lower(root.<String>get("lastName")));

            return cb.like(fullName, pattern);
        };
    }

    public static Specification<User> byRole(UserRole role) {
        return (root, query, cb) -> {
            if (role == null) return cb.conjunction();

            return cb.equal(root.get("role"), role);
        };
    }

    public static Specification<User> byRoles(List<UserRole> roles) {
        return (root, query, cb) -> {
            if (roles == null || roles.isEmpty()) return cb.conjunction();

            return root.get("role").in(roles);
        };
    }

    public static Specification<User> byActivation(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) return cb.conjunction();

            return cb.equal(root.get("isActive"), isActive);
        };
    }

    public static Specification<User> byCreatedAfter(LocalDate startDate) {
        return (root, query, cb) -> {
            if (startDate == null) return cb.conjunction();

            LocalDateTime startDateTime = startDate.atStartOfDay();

            return cb.greaterThanOrEqualTo(root.get("createdAt"), startDateTime);
        };
    }

    public static Specification<User> byCreatedBefore(LocalDate endDate) {
        return (root, query, cb) -> {
            if (endDate == null) return cb.conjunction();

            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

            return cb.lessThanOrEqualTo(root.get("createdAt"), endDateTime);
        };
    }

    public static Specification<User> byCreatedBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if (startDate == null || endDate == null) return cb.conjunction();

            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

            return cb.between(root.get("createdAt"), startDateTime, endDateTime);
        };
    }

}
