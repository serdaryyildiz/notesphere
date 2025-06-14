package com.notesphere.repository;

import com.notesphere.model.Note;
import com.notesphere.model.SharedNote;
import com.notesphere.model.User;
import com.notesphere.model.PermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SharedNoteRepository extends JpaRepository<SharedNote, Long> {
    List<SharedNote> findByNote(Note note);
    List<SharedNote> findBySharedWithUser(User sharedWithUser);
    List<SharedNote> findByNoteAndPermissionType(Note note, PermissionType permissionType);
    Optional<SharedNote> findByNoteAndSharedWithUser(Note note, User sharedWithUser);
    boolean existsByNoteAndSharedWithUser(Note note, User sharedWithUser);
    void deleteByNoteAndSharedWithUser(Note note, User sharedWithUser);
} 