package org.sti.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sti.api.dto.OrdenReparacionInDto;
import org.sti.api.dto.OrdenReparacionOutDto;
import org.sti.api.service.OrdenReparacionService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class OrdenReparacionController {

    @Autowired
    private OrdenReparacionService ordenService;

    @GetMapping("/ordenes")
    public ResponseEntity<List<OrdenReparacionOutDto>> getAllOrdenes() {
        return ResponseEntity.ok(ordenService.findAll());
    }

    @GetMapping("/ordenes/{id}")
    public ResponseEntity<OrdenReparacionOutDto> getOrdenById(@PathVariable Long id) {
        return ResponseEntity.ok(ordenService.findById(id));
    }

    @PostMapping("/ordenes")
    public ResponseEntity<OrdenReparacionOutDto> addOrden(@Valid @RequestBody OrdenReparacionInDto inDto) {
        OrdenReparacionOutDto created = ordenService.add(inDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/ordenes/{id}")
    public ResponseEntity<OrdenReparacionOutDto> updateOrden(@PathVariable Long id,
            @Valid @RequestBody OrdenReparacionInDto inDto) {
        OrdenReparacionOutDto updated = ordenService.modify(id, inDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/ordenes/{id}")
    public ResponseEntity<Void> deleteOrden(@PathVariable Long id) {
        ordenService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
