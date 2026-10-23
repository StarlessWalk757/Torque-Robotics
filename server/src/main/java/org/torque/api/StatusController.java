package org.torque.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.torque.ai.MentorAi;
import org.torque.cad.Grader;

import java.util.Map;

// one small endpoint the web app calls on load, to find out whether the ai is configured and what the
// pass mark is. means the pass mark is never typed into the front end as well
@RestController
public class StatusController {
    private final MentorAi mentor;
    private final String model;

    public StatusController(MentorAi mentor, @Value("${torque.model}") String model) {
        this.mentor = mentor;
        this.model = model;
    }

    @GetMapping("/api/status")
    Map<String, Object> status() {
        // model name only when it's actually live, so an offline server doesn't advertise a model it isn't using
        return Map.of("ai", mentor.isLive(), "model", mentor.isLive() ? model : "offline", "passPercent", Grader.passPercent);
    }
}
