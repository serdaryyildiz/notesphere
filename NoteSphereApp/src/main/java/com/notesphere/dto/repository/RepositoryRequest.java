package com.notesphere.dto.repository;

import jakarta.validation.constraints.NotBlank;

public class RepositoryRequest {
    @NotBlank
    private String name;
    
    private String description;
    
    private boolean isPublic;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
} 