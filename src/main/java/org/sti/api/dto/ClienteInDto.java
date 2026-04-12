package org.sti.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClienteInDto {

    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    private String apellidos;

    private String email;
    private String telefono;
    private String direccion;
}
