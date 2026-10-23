package org.torque.api;

import org.springframework.http.HttpStatus;

// an error whose message is safe to put on screen. anything thrown as one of these gets shown to the
// student word for word, so the message is written for them, never a stack trace or a sql error
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
