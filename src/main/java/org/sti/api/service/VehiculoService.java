package org.sti.api.service;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sti.api.domain.Cliente;
import org.sti.api.domain.Vehiculo;
import org.sti.api.dto.VehiculoInDto;
import org.sti.api.dto.VehiculoOutDto;
import org.sti.api.exception.ClienteNotFoundException;
import org.sti.api.exception.VehiculoNotFoundException;
import org.sti.api.repository.ClienteRepository;
import org.sti.api.repository.VehiculoRepository;

import java.util.List;

@Service
public class VehiculoService {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ModelMapper modelMapper;

    public VehiculoOutDto add(VehiculoInDto vehiculoInDto) {
        Cliente cliente = clienteRepository.findById(vehiculoInDto.getClienteId())
                .orElseThrow(() -> new ClienteNotFoundException(
                        "Cliente no encontrado con ID: " + vehiculoInDto.getClienteId()));

        Vehiculo vehiculo = modelMapper.map(vehiculoInDto, Vehiculo.class);
        vehiculo.setCliente(cliente);
        Vehiculo saved = vehiculoRepository.save(vehiculo);
        return toOutDto(saved);
    }

    public List<VehiculoOutDto> findAll() {
        List<Vehiculo> vehiculos = vehiculoRepository.findAll();
        return vehiculos.stream().map(this::toOutDto).toList();
    }

    public VehiculoOutDto findByMatricula(String matricula) {
        Vehiculo vehiculo = vehiculoRepository.findById(matricula)
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado con matrícula: " + matricula));
        return toOutDto(vehiculo);
    }

    public List<VehiculoOutDto> findByCliente(Long clienteId) {
        // Verify client exists first
        clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ClienteNotFoundException("Cliente no encontrado con ID: " + clienteId));
        List<Vehiculo> vehiculos = vehiculoRepository.findByClienteId(clienteId);
        return vehiculos.stream().map(this::toOutDto).toList();
    }

    public VehiculoOutDto modify(String matricula, VehiculoInDto vehiculoInDto) {
        Vehiculo existingVehiculo = vehiculoRepository.findById(matricula)
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado con matrícula: " + matricula));

        existingVehiculo.setMarca(vehiculoInDto.getMarca());
        existingVehiculo.setModelo(vehiculoInDto.getModelo());
        existingVehiculo.setAnio(vehiculoInDto.getAnio());
        existingVehiculo.setColor(vehiculoInDto.getColor());

        if (!existingVehiculo.getCliente().getId().equals(vehiculoInDto.getClienteId())) {
            Cliente cliente = clienteRepository.findById(vehiculoInDto.getClienteId())
                    .orElseThrow(() -> new ClienteNotFoundException(
                            "Cliente no encontrado con ID: " + vehiculoInDto.getClienteId()));
            existingVehiculo.setCliente(cliente);
        }

        Vehiculo saved = vehiculoRepository.save(existingVehiculo);
        return toOutDto(saved);
    }

    public void delete(String matricula) {
        Vehiculo vehiculo = vehiculoRepository.findById(matricula)
                .orElseThrow(() -> new VehiculoNotFoundException(
                        "Vehículo no encontrado con matrícula: " + matricula));
        vehiculoRepository.delete(vehiculo);
    }

    // Helper: manual mapping to flatten cliente fields into OutDto
    private VehiculoOutDto toOutDto(Vehiculo vehiculo) {
        VehiculoOutDto dto = modelMapper.map(vehiculo, VehiculoOutDto.class);
        if (vehiculo.getCliente() != null) {
            dto.setClienteId(vehiculo.getCliente().getId());
            dto.setClienteNombre(vehiculo.getCliente().getNombre());
            dto.setClienteApellidos(vehiculo.getCliente().getApellidos());
        }
        return dto;
    }
}
