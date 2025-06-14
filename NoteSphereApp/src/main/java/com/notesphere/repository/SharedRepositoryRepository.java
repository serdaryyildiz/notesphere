package com.notesphere.repository;

import com.notesphere.model.NoteRepository;
import com.notesphere.model.SharedRepository;
import com.notesphere.model.User;
import com.notesphere.model.PermissionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SharedRepositoryRepository extends JpaRepository<SharedRepository, Long> {
    List<SharedRepository> findByRepository(NoteRepository repository);
    List<SharedRepository> findBySharedWithUser(User sharedWithUser);
    List<SharedRepository> findByRepositoryAndPermissionType(NoteRepository repository, PermissionType permissionType);
    Optional<SharedRepository> findByRepositoryAndSharedWithUser(NoteRepository repository, User sharedWithUser);
    boolean existsByRepositoryAndSharedWithUser(NoteRepository repository, User sharedWithUser);
    void deleteByRepositoryAndSharedWithUser(NoteRepository repository, User sharedWithUser);
} 