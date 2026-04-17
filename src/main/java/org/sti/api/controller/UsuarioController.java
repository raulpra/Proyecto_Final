package org.sti.api.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sti.api.dto.LoginInDto;
import org.sti.api.dto.UsuarioInDto;
import org.sti.api.dto.UsuarioOutDto;
import org.sti.api.service.UsuarioService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioOutDto>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioOutDto> getUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioOutDto> addUsuario(@Valid @RequestBody UsuarioInDto usuarioInDto) {
        UsuarioOutDto created = usuarioService.add(usuarioInDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioOutDto> updateUsuario(@PathVariable Long id,
            @Valid @RequestBody UsuarioInDto usuarioInDto) {
        UsuarioOutDto updated = usuarioService.modify(id, usuarioInDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/usuarios/login")
    public ResponseEntity<UsuarioOutDto> login(@Valid @RequestBody LoginInDto loginInDto) {
        UsuarioOutDto usuario = usuarioService.login(loginInDto.getUsername(), loginInDto.getPassword());
        return ResponseEntity.ok(usuario);
    }
}
