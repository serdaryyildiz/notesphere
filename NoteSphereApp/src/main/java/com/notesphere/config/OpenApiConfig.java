package com.notesphere.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        Server localServer = new Server()
            .url("http://localhost:5000")
            .description("Local Development Server");

        Server awsServer = new Server()
            .url("http://notesphere-backend-env.eba-imphxipc.eu-north-1.elasticbeanstalk.com")
            .description("AWS Production Server");

        Contact contact = new Contact()
            .name("NoteSphere Team")
            .email("yildiz.serdaryy@gmail.com")
            .url("https://github.com/serdaryyildiz/NotesphereProject");

        License mitLicense = new License()
            .name("MIT License")
            .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
            .title("NoteSphere API")
            .version("1.0.0")
            .contact(contact)
            .description("NoteSphere, sosyal not alma ve bilgi paylaşım platformunun REST API dokümantasyonu. " +
                "Bu API ile notlar oluşturabilir, düzenleyebilir, paylaşabilir ve diğer kullanıcılarla " +
                "etkileşime geçebilirsiniz.")
            .license(mitLicense);

        // JWT Authentication için security scheme
        SecurityScheme securityScheme = new SecurityScheme()
            .type(SecurityScheme.Type.HTTP)
            .scheme("bearer")
            .bearerFormat("JWT")
            .name("JWT Authentication");

        Components components = new Components()
            .addSecuritySchemes("bearer-jwt", securityScheme);

        return new OpenAPI()
            .info(info)
            .servers(List.of(localServer, awsServer))
            .components(components)
            .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }
} 