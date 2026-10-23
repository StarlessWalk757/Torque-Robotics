package org.torque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// the whole server is one spring boot app. it serves the built web app as static files too, so there's
// one thing to run and one port, rather than a separate front end server
@SpringBootApplication
public class TorqueApplication {
    public static void main(String[] args) {
        SpringApplication.run(TorqueApplication.class, args);
    }
}
