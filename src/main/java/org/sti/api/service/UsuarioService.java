package org.sti.api.service;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sti.api.domain.Usuario;
import org.sti.api.dto.UsuarioInDto;
import org.sti.api.dto.UsuarioOutDto;
import org.sti.api.exception.UsuarioNotFoundException;
import org.sti.api.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ModelMapper modelMapper;

    public UsuarioOutDto add(UsuarioInDto usuarioInDto) {
        Usuario usuario = modelMapper.map(usuarioInDto, Usuario.class);
        Usuario saved = usuarioRepository.save(usuario);
        return modelMapper.map(saved, UsuarioOutDto.class);
    }

    public List<UsuarioOutDto> findAll() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return modelMapper.map(usuarios, new TypeToken<List<UsuarioOutDto>>() {}.getType());
    }

    public UsuarioOutDto findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con ID: " + id));
        return modelMapper.map(usuario, UsuarioOutDto.class);
    }

    public UsuarioOutDto modify(Long id, UsuarioInDto usuarioInDto) {
        Usuario existing = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con ID: " + id));
        modelMapper.map(usuarioInDto, existing);
        existing.setId(id);
        Usuario saved = usuarioRepository.save(existing);
        return modelMapper.map(saved, UsuarioOutDto.class);
    }

    public void delete(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNotFoundException("Usuario no encontrado con ID: " + id));
        usuarioRepository.delete(usuario);
    }

    public UsuarioOutDto login(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (!usuario.getPassword().equals(password)) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        if (!usuario.isActivo()) {
            throw new IllegalArgumentException("Usuario inactivo. Contacte con el administrador.");
        }

        return modelMapper.map(usuario, UsuarioOutDto.class);
    }
}
