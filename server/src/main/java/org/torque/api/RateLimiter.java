package org.torque.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

// caps ai requests per visitor per hour, so a public deployment can't run up an api bill
// only guards the ai endpoints, since those are the ones that cost money
@Component
public class RateLimiter {
    private static final long hourMs = 3_600_000L;
    private final int perHour;
    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimiter(@Value("${torque.ai-requests-per-hour}") int perHour) {
        this.perHour = perHour;
    }

    public void check(String visitor) {
        long now = System.currentTimeMillis();
        // a queue of timestamps per visitor. sliding hour, not a counter that resets on the hour --
        // otherwise someone gets a full allowance twice in two minutes either side of the reset
        Deque<Long> q = hits.computeIfAbsent(visitor, k -> new ArrayDeque<>());
        // ConcurrentHashMap guards the map, not the queues inside it, so the queue needs its own lock
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > hourMs) q.pollFirst(); // drop anything older than an hour
            if (q.size() >= perHour) {
                throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "You've hit the hourly limit for AI requests. Take a break and try again later.");
            }
            q.addLast(now);
        }
    }
}
