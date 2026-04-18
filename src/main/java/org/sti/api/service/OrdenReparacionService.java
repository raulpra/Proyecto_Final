package org.sti.api.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sti.api.domain.EstadoOrden;
import org.sti.api.domain.OrdenReparacion;
import org.sti.api.domain.Vehiculo;
import org.sti.api.dto.OrdenReparacionInDto;
import org.sti.api.dto.OrdenReparacionOutDto;
import org.sti.api.exception.OrdenReparacionNotFoundException;
import org.sti.api.exception.VehiculoNotFoundException;
import org.sti.api.repository.OrdenReparacionRepository;
import org.sti.api.repository.VehiculoRepository;

import java.util.List;

@Service
public class OrdenReparacionService {

    @Autowired
    private OrdenReparacionRepository ordenRepository;

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ModelMapper modelMapper;

    public OrdenReparacionOutDto add(OrdenReparacionInDto inDto) {
        Vehiculo vehiculo = vehiculoRepository.findById(inDto.getMatriculaVehiculo())
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado con matrícula: " + inDto.getMatriculaVehiculo()));

        OrdenReparacion orden = new OrdenReparacion();
        orden.setDescripcionAveria(inDto.getDescripcionAveria());
        orden.setEstado(inDto.getEstado() != null
                ? EstadoOrden.valueOf(inDto.getEstado())
                : EstadoOrden.PENDIENTE);
        orden.setFechaEntrada(inDto.getFechaEntrada());
        orden.setFechaSalida(inDto.getFechaSalida());
        orden.setKilometros(inDto.getKilometros());
        orden.setPrecioEstimado(inDto.getPrecioEstimado());
        orden.setPrecioFinal(inDto.getPrecioFinal());
        orden.setVehiculo(vehiculo);

        OrdenReparacion saved = ordenRepository.save(orden);
        return toOutDto(saved);
    }

    public List<OrdenReparacionOutDto> findAll() {
        return ordenRepository.findAll().stream().map(this::toOutDto).toList();
    }

    public OrdenReparacionOutDto findById(Long id) {
        OrdenReparacion orden = ordenRepository.findById(id)
                .orElseThrow(() -> new OrdenReparacionNotFoundException(
                        "Orden de reparación no encontrada con ID: " + id));
        return toOutDto(orden);
    }

    public List<OrdenReparacionOutDto> findByVehiculo(String matricula) {
        // Verify vehicle exists
        vehiculoRepository.findById(matricula)
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado con matrícula: " + matricula));
        return ordenRepository.findByVehiculoMatricula(matricula)
                .stream().map(this::toOutDto).toList();
    }

    public OrdenReparacionOutDto modify(Long id, OrdenReparacionInDto inDto) {
        OrdenReparacion existing = ordenRepository.findById(id)
                .orElseThrow(() -> new OrdenReparacionNotFoundException(
                        "Orden de reparación no encontrada con ID: " + id));

        existing.setDescripcionAveria(inDto.getDescripcionAveria());
        if (inDto.getEstado() != null) {
            existing.setEstado(EstadoOrden.valueOf(inDto.getEstado()));
        }
        existing.setFechaEntrada(inDto.getFechaEntrada());
        existing.setFechaSalida(inDto.getFechaSalida());
        existing.setKilometros(inDto.getKilometros());
        existing.setPrecioEstimado(inDto.getPrecioEstimado());
        existing.setPrecioFinal(inDto.getPrecioFinal());

        // Update vehiculo if changed
        if (!existing.getVehiculo().getMatricula().equals(inDto.getMatriculaVehiculo())) {
            Vehiculo vehiculo = vehiculoRepository.findById(inDto.getMatriculaVehiculo())
                    .orElseThrow(() -> new VehiculoNotFoundException(
                            "Vehículo no encontrado con matrícula: " + inDto.getMatriculaVehiculo()));
            existing.setVehiculo(vehiculo);
        }

        OrdenReparacion saved = ordenRepository.save(existing);
        return toOutDto(saved);
    }

    public void delete(Long id) {
        OrdenReparacion orden = ordenRepository.findById(id)
                .orElseThrow(() -> new OrdenReparacionNotFoundException(
                        "Orden de reparación no encontrada con ID: " + id));
        ordenRepository.delete(orden);
    }

    // Helper: flatten vehiculo fields into OutDto
    private OrdenReparacionOutDto toOutDto(OrdenReparacion orden) {
        OrdenReparacionOutDto dto = new OrdenReparacionOutDto();
        dto.setId(orden.getId());
        dto.setDescripcionAveria(orden.getDescripcionAveria());
        dto.setEstado(orden.getEstado() != null ? orden.getEstado().name() : null);
        dto.setFechaEntrada(orden.getFechaEntrada());
        dto.setFechaSalida(orden.getFechaSalida());
        dto.setKilometros(orden.getKilometros());
        dto.setPrecioEstimado(orden.getPrecioEstimado());
        dto.setPrecioFinal(orden.getPrecioFinal());
        if (orden.getVehiculo() != null) {
            dto.setMatriculaVehiculo(orden.getVehiculo().getMatricula());
            dto.setMarcaVehiculo(orden.getVehiculo().getMarca());
            dto.setModeloVehiculo(orden.getVehiculo().getModelo());
        }
        return dto;
    }
}
