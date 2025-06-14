package com.notesphere.model;

public enum Visibility {
    PUBLIC("Public"),
    PRIVATE("Private");

    private final String displayName;

    Visibility(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Visibility fromString(String value) {
        for (Visibility v : Visibility.values()) {
            if (v.name().equalsIgnoreCase(value) || v.getDisplayName().equalsIgnoreCase(value)) {
                return v;
            }
        }
        throw new IllegalArgumentException("Invalid visibility value: " + value);
    }
}