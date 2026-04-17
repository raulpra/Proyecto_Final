package org.sti.api.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.sti.api.domain.Usuario;
import org.sti.api.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword("admin");
                admin.setNombre("Administrador STI");
                admin.setRol("ADMIN");
                admin.setActivo(true);
                usuarioRepository.save(admin);
            }
        };
    }
}
