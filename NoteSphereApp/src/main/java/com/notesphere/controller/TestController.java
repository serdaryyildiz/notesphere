package com.notesphere.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/test")
@Tag(name = "Test Controller", description = "Endpoints for testing system connectivity")
public class TestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db")
    @Operation(summary = "Test database connection", 
               description = "Returns database version and connection status")
    public Map<String, Object> testDatabaseConnection() {
        String dbVersion = jdbcTemplate.queryForObject("SELECT @@VERSION", String.class);
        return Map.of(
            "status", "success",
            "message", "Database connection successful",
            "databaseVersion", dbVersion
        );
    }

    @GetMapping("/ping")
    @Operation(summary = "Test API availability", 
               description = "Simple endpoint to verify if the API is up and running")
    public Map<String, String> ping() {
        return Map.of(
            "status", "success",
            "message", "API is up and running"
        );
    }
} 