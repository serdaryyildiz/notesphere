package com.notesphere.service;

import com.notesphere.model.*;
import com.notesphere.repository.CommentRepository;
import com.notesphere.repository.NoteRepository;
import com.notesphere.repository.RepositoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final NoteRepository noteRepository;
    private final RepositoryRepository repositoryRepository;

    public CommentService(CommentRepository commentRepository, NoteRepository noteRepository, RepositoryRepository repositoryRepository) {
        this.commentRepository = commentRepository;
        this.noteRepository = noteRepository;
        this.repositoryRepository = repositoryRepository;
    }

    @Transactional
    public Comment addNoteComment(User user, Long noteId, String content) {
        // Verify note exists
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setNote(note);
        comment.setCommentableType(CommentableType.NOTE);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment addRepositoryComment(User user, Long repositoryId, String content) {
        // Verify repository exists
        com.notesphere.model.NoteRepository repository = repositoryRepository.findById(repositoryId)
            .orElseThrow(() -> new EntityNotFoundException("Repository not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setNote(null); // Not a note comment
        comment.setCommentableType(CommentableType.REPOSITORY);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(User user, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().equals(user)) {
            throw new IllegalStateException("User is not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    public List<Comment> getNoteComments(Long noteId) {
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));
        return commentRepository.findByNoteAndCommentableTypeOrderByCreatedAtDesc(
            note, CommentableType.NOTE);
    }

    public List<Comment> getRepositoryComments(Long repositoryId) {
        return commentRepository.findByNoteAndCommentableTypeOrderByCreatedAtDesc(
            null, CommentableType.REPOSITORY);
    }

    public List<Comment> getUserComments(User user) {
        return commentRepository.findByUser(user);
    }
} 