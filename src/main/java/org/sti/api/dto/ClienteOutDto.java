package org.sti.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClienteOutDto {

    private Long id;
    private String dni;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private String direccion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaAlta;
}
