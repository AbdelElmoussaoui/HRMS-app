package com.example.hrms.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "HR Management System API",
                version = "v1",
                description = "API documentation for the HR Management System",
                license = @License(name = "MIT")
        )
)
public class OpenApiConfig {
}
