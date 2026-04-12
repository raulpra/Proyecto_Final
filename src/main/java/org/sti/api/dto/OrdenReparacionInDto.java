package org.sti.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrdenReparacionInDto {

    @NotBlank(message = "La descripción de la avería es obligatoria")
    private String descripcionAveria;

    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaEntrada;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaSalida;

    private int kilometros;
    private double precioEstimado;
    private double precioFinal;

    @NotBlank(message = "La matrícula del vehículo es obligatoria")
    private String matriculaVehiculo;
}
