package org.sti.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sti.api.dto.ClienteInDto;
import org.sti.api.dto.ClienteOutDto;
import org.sti.api.dto.VehiculoOutDto;
import org.sti.api.service.ClienteService;
import org.sti.api.service.VehiculoService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private VehiculoService vehiculoService;

    @GetMapping("/clientes")
    public ResponseEntity<List<ClienteOutDto>> getAllClientes() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    @GetMapping("/clientes/{id}")
    public ResponseEntity<ClienteOutDto> getClienteById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.findById(id));
    }

    @GetMapping("/clientes/{id}/vehiculos")
    public ResponseEntity<List<VehiculoOutDto>> getVehiculosByCliente(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculoService.findByCliente(id));
    }

    @PostMapping("/clientes")
    public ResponseEntity<ClienteOutDto> addCliente(@Valid @RequestBody ClienteInDto clienteInDto) {
        ClienteOutDto created = clienteService.add(clienteInDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<ClienteOutDto> updateCliente(@PathVariable Long id,
            @Valid @RequestBody ClienteInDto clienteInDto) {
        ClienteOutDto updated = clienteService.modify(id, clienteInDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        clienteService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
