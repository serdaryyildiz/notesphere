package com.notesphere.model;

public enum PermissionType {
    READ("Read"),
    WRITE("Write");

    private final String displayName;

    PermissionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 