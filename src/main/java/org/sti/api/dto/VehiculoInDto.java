package org.sti.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehiculoInDto {

    @NotBlank(message = "La matrícula es obligatoria")
    private String matricula;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    private int anio;
    private String color;

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;
}
