package org.sti.api.dto;

import lombok.Data;

@Data
public class VehiculoOutDto {

    private String matricula;
    private String marca;
    private String modelo;
    private int anio;
    private String color;
    private Long clienteId;
    private String clienteNombre;
    private String clienteApellidos;
}
