package org.sti.api.exception;

public class VehiculoNotFoundException extends RuntimeException {
    public VehiculoNotFoundException(String message) {
        super(message);
    }
}
