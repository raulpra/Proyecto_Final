package org.sti.api.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "ordenes_reparacion")
public class OrdenReparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descripcion_averia", nullable = false, length = 500)
    private String descripcionAveria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoOrden estado;

    @Column(name = "fecha_entrada")
    private LocalDateTime fechaEntrada;

    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @Column(name = "kilometros")
    private int kilometros;

    @Column(name = "precio_estimado")
    private double precioEstimado;

    @Column(name = "precio_final")
    private double precioFinal;

    @ManyToOne
    @JoinColumn(name = "vehiculo_matricula", nullable = false)
    private Vehiculo vehiculo;

    @PrePersist
    public void prePersist() {
        if (this.estado == null) {
            this.estado = EstadoOrden.PENDIENTE;
        }
        if (this.fechaEntrada == null) {
            this.fechaEntrada = LocalDateTime.now();
        }
    }
}
