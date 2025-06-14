package com.notesphere.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db-status")
    public Map<String, Object> checkDatabaseStatus() {
        try {
            // Veritabanı bağlantısını kontrol et
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            
            // Tablo listesini al
            List<String> tables = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo'",
                String.class
            );
            
            // Users tablosunun yapısını kontrol et
            List<Map<String, Object>> userTableColumns = jdbcTemplate.queryForList(
                "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND TABLE_SCHEMA = 'dbo'"
            );

            return Map.of(
                "status", "connected",
                "tables", tables,
                "usersTableColumns", userTableColumns
            );
        } catch (Exception e) {
            return Map.of(
                "status", "error",
                "error", e.getMessage(),
                "errorType", e.getClass().getName()
            );
        }
    }

    @PostMapping("/reset-schema")
    public Map<String, Object> resetSchema() {
        try {
            // Mevcut tabloları temizle
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.messages");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.notifications");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.comments");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.likes");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.shared_notes");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.shared_repositories");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.follows");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.friendships");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.repository_notes");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.notes");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.note_repositories");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.users");
            jdbcTemplate.execute("DROP TABLE IF EXISTS dbo.categories");

            return Map.of(
                "status", "success",
                "message", "Tüm tablolar başarıyla silindi. Uygulama yeniden başlatıldığında tablolar tekrar oluşturulacak."
            );
        } catch (Exception e) {
            return Map.of(
                "status", "error",
                "error", e.getMessage(),
                "errorType", e.getClass().getName()
            );
        }
    }
}