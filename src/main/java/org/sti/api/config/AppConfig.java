package org.sti.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public OpenAPI stiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("STI — Sistema de Talleres Integrado")
                        .version("1.0.0")
                        .description("API REST para la gestión del ciclo de vida de reparaciones en un taller mecánico.")
                        .contact(new Contact()
                                .name("STI Dev Team")));
    }
}
