package com.notesphere.model;

public enum NotificationType {
    LIKE("Like"),
    COMMENT("Comment"),
    FRIEND_REQUEST("Friend Request"),
    SHARE("Share"),
    FOLLOW("Follow"),
    MESSAGE("Message");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 