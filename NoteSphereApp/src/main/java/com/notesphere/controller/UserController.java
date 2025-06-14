package com.notesphere.controller;

import com.notesphere.model.User;
import com.notesphere.model.Friendship;
import com.notesphere.model.FriendshipStatus;
import com.notesphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Password'ü null yaparak client'a göndermicez
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/friends/{username}")
    public ResponseEntity<?> toggleFriend(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails currentUser) {
        
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        
        User friend = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        boolean areFriends = user.getFriendshipsRequested().stream()
                .anyMatch(f -> f.getReceiver().equals(friend)) ||
                user.getFriendshipsReceived().stream()
                .anyMatch(f -> f.getRequester().equals(friend));

        if (areFriends) {
            user.getFriendshipsRequested().removeIf(f -> f.getReceiver().equals(friend));
            user.getFriendshipsReceived().removeIf(f -> f.getRequester().equals(friend));
            friend.getFriendshipsRequested().removeIf(f -> f.getReceiver().equals(user));
            friend.getFriendshipsReceived().removeIf(f -> f.getRequester().equals(user));
        } else {
            Friendship friendship = new Friendship();
            friendship.setRequester(user);
            friendship.setReceiver(friend);
            friendship.setStatus(FriendshipStatus.ACCEPTED);
            user.getFriendshipsRequested().add(friendship);
        }

        userRepository.save(user);
        userRepository.save(friend);

        return ResponseEntity.ok().build();
    }
} 