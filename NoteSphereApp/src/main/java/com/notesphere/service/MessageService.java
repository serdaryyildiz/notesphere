package com.notesphere.service;

import com.notesphere.model.Message;
import com.notesphere.model.MessageStatus;
import com.notesphere.model.User;
import com.notesphere.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Transactional
    public Message sendMessage(User sender, User receiver, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setStatus(MessageStatus.SENT);
        return messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(User user, Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getSender().equals(user) && !message.getReceiver().equals(user)) {
            throw new IllegalStateException("User is not authorized to delete this message");
        }

        // Soft delete
        message.setDeletedAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    @Transactional
    public void markAsDelivered(User receiver, Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getReceiver().equals(receiver)) {
            throw new IllegalStateException("User is not the receiver of this message");
        }

        if (message.getStatus() == MessageStatus.SENT) {
            message.setStatus(MessageStatus.DELIVERED);
            messageRepository.save(message);
        }
    }

    @Transactional
    public void markAsRead(User receiver, Long messageId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        if (!message.getReceiver().equals(receiver)) {
            throw new IllegalStateException("User is not the receiver of this message");
        }

        if (message.getStatus() != MessageStatus.READ) {
            message.setStatus(MessageStatus.READ);
            messageRepository.save(message);
        }
    }

    public List<Message> getConversation(User user1, User user2) {
        return messageRepository.findConversation(user1, user2);
    }

    public List<Message> getSentMessages(User sender) {
        return messageRepository.findBySenderAndDeletedAtIsNull(sender);
    }

    public List<Message> getReceivedMessages(User receiver) {
        return messageRepository.findByReceiverAndDeletedAtIsNull(receiver);
    }

    public List<Message> getUnreadMessages(User receiver) {
        return messageRepository.findByReceiverAndStatus(receiver, MessageStatus.SENT);
    }

    public List<User> getMessagedUsers(User user) {
        List<User> senders = messageRepository.findDistinctSenders(user);
        List<User> receivers = messageRepository.findDistinctReceivers(user);
        
        // Combine unique users
        senders.removeAll(receivers);
        senders.addAll(receivers);
        return senders;
    }
} 