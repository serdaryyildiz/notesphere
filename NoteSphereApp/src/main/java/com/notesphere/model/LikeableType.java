package com.notesphere.model;

public enum LikeableType {
    NOTE("Note"),
    REPOSITORY("Repository");

    private final String displayName;

    LikeableType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 