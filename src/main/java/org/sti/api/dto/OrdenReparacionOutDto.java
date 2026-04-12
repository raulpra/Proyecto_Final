package org.sti.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OrdenReparacionOutDto {

    private Long id;
    private String descripcionAveria;
    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaEntrada;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaSalida;

    private int kilometros;
    private double precioEstimado;
    private double precioFinal;
    private String matriculaVehiculo;
    private String marcaVehiculo;
    private String modeloVehiculo;
}
