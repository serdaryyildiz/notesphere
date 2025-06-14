package com.notesphere.repository;

import com.notesphere.model.Comment;
import com.notesphere.model.User;
import com.notesphere.model.Note;
import com.notesphere.model.CommentableType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByUser(User user);
    List<Comment> findByNoteAndCommentableType(Note note, CommentableType commentableType);
    List<Comment> findByNoteAndCommentableTypeOrderByCreatedAtDesc(Note note, CommentableType commentableType);
    void deleteByUserAndNoteAndCommentableType(User user, Note note, CommentableType commentableType);
} 