package org.sti.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClienteNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClienteNotFound(ClienteNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(VehiculoNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleVehiculoNotFound(VehiculoNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(OrdenReparacionNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrdenNotFound(OrdenReparacionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(UsuarioNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioNotFound(UsuarioNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.notFound(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.unauthorized(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.validationError(errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralError(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.generalError(500, "Internal Server Error", ex.getMessage()));
    }
}
