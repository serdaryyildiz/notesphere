package com.notesphere.model;

public enum CommentableType {
    NOTE("Note"),
    REPOSITORY("Repository");

    private final String displayName;

    CommentableType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 