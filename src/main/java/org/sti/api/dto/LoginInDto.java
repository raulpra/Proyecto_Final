package org.sti.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginInDto {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
