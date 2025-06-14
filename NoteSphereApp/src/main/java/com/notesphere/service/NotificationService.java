package com.notesphere.service;

import com.notesphere.model.*;
import com.notesphere.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(User user, NotificationType type, Long referenceId, 
                                         ReferenceType referenceType, String content) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setContent(content);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(User user, Long notificationId) {
        notificationRepository.markAsRead(notificationId, user);
    }

    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsRead(user);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countUnreadNotifications(user);
    }

    public List<Notification> getNotificationsByType(User user, NotificationType type) {
        return notificationRepository.findByUserAndType(user, type);
    }

    @Transactional
    public void createLikeNotification(User targetUser, User liker, LikeableType type, Long likeableId) {
        String content = String.format("%s liked your %s", 
            liker.getUsername(), 
            type.getDisplayName().toLowerCase());

        createNotification(
            targetUser,
            NotificationType.LIKE,
            likeableId,
            type == LikeableType.NOTE ? ReferenceType.NOTE : ReferenceType.REPOSITORY,
            content
        );
    }

    @Transactional
    public void createCommentNotification(User targetUser, User commenter, CommentableType type, Long commentableId) {
        String content = String.format("%s commented on your %s", 
            commenter.getUsername(), 
            type.getDisplayName().toLowerCase());

        createNotification(
            targetUser,
            NotificationType.COMMENT,
            commentableId,
            type == CommentableType.NOTE ? ReferenceType.NOTE : ReferenceType.REPOSITORY,
            content
        );
    }

    @Transactional
    public void createFriendRequestNotification(User targetUser, User requester) {
        String content = String.format("%s sent you a friend request", requester.getUsername());

        createNotification(
            targetUser,
            NotificationType.FRIEND_REQUEST,
            requester.getId(),
            ReferenceType.USER,
            content
        );
    }

    @Transactional
    public void createShareNotification(User targetUser, User sharer, ReferenceType type, Long referenceId) {
        String content = String.format("%s shared a %s with you", 
            sharer.getUsername(), 
            type.getDisplayName().toLowerCase());

        createNotification(
            targetUser,
            NotificationType.SHARE,
            referenceId,
            type,
            content
        );
    }

    @Transactional
    public void createFollowNotification(User targetUser, User follower, Long repositoryId) {
        String content = String.format("%s started following your repository", follower.getUsername());

        createNotification(
            targetUser,
            NotificationType.FOLLOW,
            repositoryId,
            ReferenceType.REPOSITORY,
            content
        );
    }

    @Transactional
    public void createMessageNotification(User targetUser, User sender) {
        String content = String.format("You have a new message from %s", sender.getUsername());

        createNotification(
            targetUser,
            NotificationType.MESSAGE,
            sender.getId(),
            ReferenceType.USER,
            content
        );
    }
} 