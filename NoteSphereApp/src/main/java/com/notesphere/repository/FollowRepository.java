package com.notesphere.repository;

import com.notesphere.model.Follow;
import com.notesphere.model.User;
import com.notesphere.model.NoteRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowed(NoteRepository followed);
    Optional<Follow> findByFollowerAndFollowed(User follower, NoteRepository followed);
    boolean existsByFollowerAndFollowed(User follower, NoteRepository followed);
    void deleteByFollowerAndFollowed(User follower, NoteRepository followed);
} 