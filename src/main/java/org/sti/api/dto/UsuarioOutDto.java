package org.sti.api.dto;

import lombok.Data;

@Data
public class UsuarioOutDto {

    private Long id;
    private String username;
    private String nombre;
    private String rol;
    private boolean activo;
}
