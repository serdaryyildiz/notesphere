package com.notesphere.repository;

import com.notesphere.model.Message;
import com.notesphere.model.MessageStatus;
import com.notesphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndDeletedAtIsNull(User sender);
    List<Message> findByReceiverAndDeletedAtIsNull(User receiver);
    
    @Query("SELECT m FROM Message m WHERE " +
           "((m.sender = :user1 AND m.receiver = :user2) OR " +
           "(m.sender = :user2 AND m.receiver = :user1)) AND " +
           "m.deletedAt IS NULL " +
           "ORDER BY m.createdAt DESC")
    List<Message> findConversation(User user1, User user2);
    
    List<Message> findByReceiverAndStatus(User receiver, MessageStatus status);
    
    @Query("SELECT DISTINCT m.sender FROM Message m WHERE m.receiver = :user AND m.deletedAt IS NULL")
    List<User> findDistinctSenders(User user);
    
    @Query("SELECT DISTINCT m.receiver FROM Message m WHERE m.sender = :user AND m.deletedAt IS NULL")
    List<User> findDistinctReceivers(User user);
} 