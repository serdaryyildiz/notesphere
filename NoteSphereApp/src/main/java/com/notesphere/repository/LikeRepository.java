package com.notesphere.repository;

import com.notesphere.model.Like;
import com.notesphere.model.LikeableType;
import com.notesphere.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByUser(User user);
    List<Like> findByLikeableIdAndLikeableType(Long likeableId, LikeableType likeableType);
    Optional<Like> findByUserAndLikeableIdAndLikeableType(User user, Long likeableId, LikeableType likeableType);
    boolean existsByUserAndLikeableIdAndLikeableType(User user, Long likeableId, LikeableType likeableType);
    void deleteByUserAndLikeableIdAndLikeableType(User user, Long likeableId, LikeableType likeableType);
} 