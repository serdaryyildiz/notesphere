package com.notesphere.repository;

import com.notesphere.model.Note;
import com.notesphere.model.User;
import com.notesphere.model.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.notesphere.model.Category;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByCreator(User creator);
    Page<Note> findByCreator(User creator, Pageable pageable);
    List<Note> findByCreatorAndVisibility(User creator, Visibility visibility);
    
    @Query("SELECT n FROM Note n WHERE n.visibility = 'PUBLIC' OR n.creator = :user")
    List<Note> findAccessibleNotes(User user);
    
    @Query("SELECT n FROM Note n WHERE " +
           "(n.visibility = 'PUBLIC' OR n.creator = :user) AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Note> searchNotes(String searchTerm, User user);
    
    @Query("SELECT n FROM Note n JOIN SharedNote sn ON n.id = sn.note.id " +
           "WHERE sn.sharedWithUser = :user")
    List<Note> findSharedWithUser(User user);

    List<Note> findAllByCategory(Category category);


    Page<Note> findByVisibility(Visibility visibility, Pageable pageable);
} 