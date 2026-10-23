package org.torque.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.torque.ai.SimLab;

import java.util.List;

// simulation lab endpoints. all the deciding happens in SimLab, this just wires it to http
@RestController
public class SimController {
    // ObjectProvider rather than SimLab directly, because with no api key the bean doesn't exist at all.
    // injecting it straight would stop the whole server booting over one optional feature
    private final ObjectProvider<SimLab> lab;
    private final RateLimiter limiter;

    public SimController(ObjectProvider<SimLab> lab, RateLimiter limiter) {
        this.lab = lab;
        this.limiter = limiter;
    }

    public record Ask(String prompt) {}

    @GetMapping("/api/sim/topics")
    List<String> topics() {
        return SimLab.topics;
    }

    @PostMapping("/api/sim/build")
    SimLab.Built build(@RequestBody Ask ask, HttpServletRequest req) {
        SimLab live = lab.getIfAvailable();
        if (live == null) { // no key configured. say so plainly rather than 500-ing

            return new SimLab.Built(false, "", "",
                    "The simulation lab needs the server's ANTHROPIC_API_KEY to be set. Everything else on the site works without it.");
        }
        // rate limit before building, not after -- the cost is in the building
        limiter.check(req.getRemoteAddr() == null ? "anon" : req.getRemoteAddr());
        return live.build(ask == null ? "" : ask.prompt());
    }
}
