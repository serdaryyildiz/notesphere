package com.notesphere.repository;

import com.notesphere.model.Friendship;
import com.notesphere.model.FriendshipStatus;
import com.notesphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user1 AND f.receiver = :user2) OR " +
           "(f.requester = :user2 AND f.receiver = :user1)")
    Optional<Friendship> findFriendship(User user1, User user2);
    
    List<Friendship> findByRequesterAndStatus(User requester, FriendshipStatus status);
    List<Friendship> findByReceiverAndStatus(User receiver, FriendshipStatus status);
    
    @Query("SELECT f.receiver FROM Friendship f WHERE f.requester = :user AND f.status = 'ACCEPTED'")
    List<User> findAcceptedFriends(User user);
    
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user OR f.receiver = :user) AND " +
           "f.status = 'ACCEPTED'")
    List<Friendship> findAllAcceptedFriendships(User user);
    
    boolean existsByRequesterAndReceiverAndStatus(User requester, User receiver, FriendshipStatus status);
} 