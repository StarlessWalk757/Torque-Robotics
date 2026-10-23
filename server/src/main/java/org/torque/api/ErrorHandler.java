package org.torque.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.torque.cad.StlParser;

import java.util.Map;

// one place that turns exceptions into json, instead of every controller doing its own try/catch.
// spring routes to whichever handler matches the thrown type most closely
@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(ApiException.class)
    ResponseEntity<Map<String, String>> api(ApiException e) {
        return ResponseEntity.status(e.status()).body(Map.of("error", e.getMessage()));
    }

    // 422 not 400: the request itself was fine, the file inside it was the problem
    @ExceptionHandler(StlParser.StlException.class)
    ResponseEntity<Map<String, String>> stl(StlParser.StlException e) {
        return ResponseEntity.unprocessableEntity().body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<Map<String, String>> tooBig(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(Map.of("error", "That upload is too large. STL files can be up to 25 MB and screenshots up to 5 MB each."));
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, HttpMessageNotReadableException.class, MissingServletRequestPartException.class})
    ResponseEntity<Map<String, String>> badRequest(Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Some of the information wasn't filled in correctly."));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    ResponseEntity<Map<String, String>> notFound(NoResourceFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Not found."));
    }

    // catch-all. the real exception goes to the log, and the visitor gets a flat apology -- an unplanned
    // error message can leak file paths or table names, so none of it goes out
    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, String>> other(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Something went wrong on our side. Please try again."));
    }
}
