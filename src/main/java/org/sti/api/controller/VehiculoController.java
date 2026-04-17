package org.sti.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sti.api.dto.OrdenReparacionOutDto;
import org.sti.api.dto.VehiculoInDto;
import org.sti.api.dto.VehiculoOutDto;
import org.sti.api.service.OrdenReparacionService;
import org.sti.api.service.VehiculoService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @Autowired
    private OrdenReparacionService ordenService;

    @GetMapping("/vehiculos")
    public ResponseEntity<List<VehiculoOutDto>> getAllVehiculos() {
        return ResponseEntity.ok(vehiculoService.findAll());
    }

    @GetMapping("/vehiculos/{matricula}")
    public ResponseEntity<VehiculoOutDto> getVehiculoByMatricula(@PathVariable String matricula) {
        return ResponseEntity.ok(vehiculoService.findByMatricula(matricula));
    }

    @GetMapping("/vehiculos/{matricula}/ordenes")
    public ResponseEntity<List<OrdenReparacionOutDto>> getOrdenesByVehiculo(@PathVariable String matricula) {
        return ResponseEntity.ok(ordenService.findByVehiculo(matricula));
    }

    @PostMapping("/vehiculos")
    public ResponseEntity<VehiculoOutDto> addVehiculo(@Valid @RequestBody VehiculoInDto vehiculoInDto) {
        VehiculoOutDto created = vehiculoService.add(vehiculoInDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/vehiculos/{matricula}")
    public ResponseEntity<VehiculoOutDto> updateVehiculo(@PathVariable String matricula,
            @Valid @RequestBody VehiculoInDto vehiculoInDto) {
        VehiculoOutDto updated = vehiculoService.modify(matricula, vehiculoInDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/vehiculos/{matricula}")
    public ResponseEntity<Void> deleteVehiculo(@PathVariable String matricula) {
        vehiculoService.delete(matricula);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
