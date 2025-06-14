package com.notesphere.model;

public enum FriendshipStatus {
    PENDING("Pending"),
    ACCEPTED("Accepted"),
    REJECTED("Rejected"),
    BLOCKED("Blocked");

    private final String displayName;

    FriendshipStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 