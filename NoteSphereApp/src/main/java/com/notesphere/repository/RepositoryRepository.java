package com.notesphere.repository;

import com.notesphere.model.NoteRepository;
import com.notesphere.model.User;
import com.notesphere.model.Visibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RepositoryRepository extends JpaRepository<NoteRepository, Long> {
    List<NoteRepository> findByCreator(User creator);
    Page<NoteRepository> findByCreator(User creator, Pageable pageable);
    List<NoteRepository> findByVisibility(Visibility visibility);
    Page<NoteRepository> findByVisibility(Visibility visibility, Pageable pageable);
    
    @Query("SELECT r FROM NoteRepository r WHERE r.visibility = 'PUBLIC' OR r.creator = :user")
    List<NoteRepository> findAccessibleRepositories(User user);
    
    @Query("SELECT r FROM NoteRepository r WHERE " +
           "(r.visibility = 'PUBLIC' OR r.creator = :user) AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<NoteRepository> searchRepositories(String searchTerm, User user);
    
    @Query("SELECT r FROM NoteRepository r JOIN SharedRepository sr ON r.id = sr.repository.id " +
           "WHERE sr.sharedWithUser = :user")
    List<NoteRepository> findSharedWithUser(User user);
} 