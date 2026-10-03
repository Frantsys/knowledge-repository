package com.frantsys.knowledge_repository.modules.User.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    @DisplayName("isEnabled should be true only for active users")
    void isEnabled_shouldReflectActivation() {
        User user = new User();

        user.setIsActive(true);
        assertThat(user.isEnabled()).isTrue();

        user.setIsActive(false);
        assertThat(user.isEnabled()).isFalse();

        user.setIsActive(null);
        assertThat(user.isEnabled()).isFalse();
    }

    @Test
    @DisplayName("getFullName should join first and last name")
    void getFullName_shouldJoinNames() {
        User user = new User();
        user.setFirstName("Anna");
        user.setLastName("Smith");

        assertThat(user.getFullName()).isEqualTo("Anna Smith");
    }

}
