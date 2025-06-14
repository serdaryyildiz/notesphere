package com.notesphere.service;

import com.notesphere.model.Friendship;
import com.notesphere.model.FriendshipStatus;
import com.notesphere.model.User;
import com.notesphere.repository.FriendshipRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;

    public FriendshipService(FriendshipRepository friendshipRepository) {
        this.friendshipRepository = friendshipRepository;
    }

    @Transactional
    public Friendship sendFriendRequest(User requester, User receiver) {
        if (requester.equals(receiver)) {
            throw new IllegalStateException("Cannot send friend request to yourself");
        }

        if (friendshipRepository.findFriendship(requester, receiver).isPresent()) {
            throw new IllegalStateException("Friendship already exists");
        }

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipStatus.PENDING);
        return friendshipRepository.save(friendship);
    }

    @Transactional
    public Friendship acceptFriendRequest(User receiver, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new EntityNotFoundException("Friend request not found"));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new IllegalStateException("User is not the receiver of this friend request");
        }

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipRepository.save(friendship);
    }

    @Transactional
    public Friendship rejectFriendRequest(User receiver, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new EntityNotFoundException("Friend request not found"));

        if (!friendship.getReceiver().equals(receiver)) {
            throw new IllegalStateException("User is not the receiver of this friend request");
        }

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalStateException("Friend request is not pending");
        }

        friendship.setStatus(FriendshipStatus.REJECTED);
        return friendshipRepository.save(friendship);
    }

    @Transactional
    public Friendship blockUser(User blocker, User blocked) {
        Friendship friendship = friendshipRepository.findFriendship(blocker, blocked)
            .orElseGet(() -> {
                Friendship newFriendship = new Friendship();
                newFriendship.setRequester(blocker);
                newFriendship.setReceiver(blocked);
                return newFriendship;
            });

        friendship.setStatus(FriendshipStatus.BLOCKED);
        return friendshipRepository.save(friendship);
    }

    @Transactional
    public void removeFriendship(User user, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow(() -> new EntityNotFoundException("Friendship not found"));

        if (!friendship.getRequester().equals(user) && !friendship.getReceiver().equals(user)) {
            throw new IllegalStateException("User is not part of this friendship");
        }

        friendshipRepository.delete(friendship);
    }

    public List<User> getFriends(User user) {
        return friendshipRepository.findAcceptedFriends(user);
    }

    public List<Friendship> getPendingRequests(User receiver) {
        return friendshipRepository.findByReceiverAndStatus(receiver, FriendshipStatus.PENDING);
    }

    public List<Friendship> getSentRequests(User requester) {
        return friendshipRepository.findByRequesterAndStatus(requester, FriendshipStatus.PENDING);
    }

    public boolean areFriends(User user1, User user2) {
        return friendshipRepository.existsByRequesterAndReceiverAndStatus(user1, user2, FriendshipStatus.ACCEPTED) ||
               friendshipRepository.existsByRequesterAndReceiverAndStatus(user2, user1, FriendshipStatus.ACCEPTED);
    }

    public boolean isBlocked(User user1, User user2) {
        return friendshipRepository.existsByRequesterAndReceiverAndStatus(user1, user2, FriendshipStatus.BLOCKED) ||
               friendshipRepository.existsByRequesterAndReceiverAndStatus(user2, user1, FriendshipStatus.BLOCKED);
    }
} 