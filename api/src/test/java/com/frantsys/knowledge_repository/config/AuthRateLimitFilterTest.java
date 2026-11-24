package com.frantsys.knowledge_repository.config;

import org.junit.jupiter.api.Test;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class AuthRateLimitFilterTest {

    private final AuthRateLimitFilter filter = new AuthRateLimitFilter();
    private final AuthRateLimitFilter.Rule rule = new AuthRateLimitFilter.Rule(3, Duration.ofMinutes(1));

    @Test
    void allowsUpToTheLimitThenBlocksWithRetryAfter() {
        for (int i = 0; i < 3; i++) {
            assertThat(filter.tryAcquire("login|1.1.1.1", rule, 0)).isZero();
        }

        assertThat(filter.tryAcquire("login|1.1.1.1", rule, 10_000)).isEqualTo(50);
    }

    @Test
    void reopensAfterTheWindow() {
        for (int i = 0; i < 4; i++) {
            filter.tryAcquire("login|1.1.1.1", rule, 0);
        }

        assertThat(filter.tryAcquire("login|1.1.1.1", rule, 60_000)).isZero();
    }

    @Test
    void countsEachClientSeparately() {
        for (int i = 0; i < 4; i++) {
            filter.tryAcquire("login|1.1.1.1", rule, 0);
        }

        assertThat(filter.tryAcquire("login|2.2.2.2", rule, 0)).isZero();
    }

}
