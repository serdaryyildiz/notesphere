package com.notesphere.model;

public enum ReferenceType {
    NOTE("Note"),
    REPOSITORY("Repository"),
    USER("User"),
    MESSAGE("Message");

    private final String displayName;

    ReferenceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 