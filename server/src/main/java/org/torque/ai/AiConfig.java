package org.torque.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// decides at startup which mentor to use. env var not a config file, so a key never ends up committed.
// no key is a supported way to run, not an error: measurement still works, only the written feedback changes
@Configuration
public class AiConfig {

    // returns null on purpose. a null @Bean means spring just doesn't register it, and SimController
    // asks for it through ObjectProvider, so the server boots fine without a key
    @Bean
    SimLab simLab(@Value("${torque.model}") String model) {
        String key = System.getenv("ANTHROPIC_API_KEY");
        return key == null || key.isBlank() ? null : new SimLab(key, model);
    }

    @Bean
    MentorAi mentorAi(@Value("${torque.model}") String model) {
        String key = System.getenv("ANTHROPIC_API_KEY");
        if (key == null || key.isBlank()) {
            System.out.println("Torque: ANTHROPIC_API_KEY is not set. Grading still measures everything; the mentor runs in offline mode.");
            return new OfflineMentor();
        }
        System.out.println("Torque: AI mentor connected (" + model + ").");
        return new ClaudeMentor(key, model);
    }
}
