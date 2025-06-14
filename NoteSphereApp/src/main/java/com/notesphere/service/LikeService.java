package com.notesphere.service;

import com.notesphere.model.*;
import com.notesphere.repository.LikeRepository;
import com.notesphere.repository.NoteRepository;
import com.notesphere.repository.RepositoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final NoteRepository noteRepository;
    private final RepositoryRepository repositoryRepository;

    public LikeService(LikeRepository likeRepository, NoteRepository noteRepository, RepositoryRepository repositoryRepository) {
        this.likeRepository = likeRepository;
        this.noteRepository = noteRepository;
        this.repositoryRepository = repositoryRepository;
    }

    @Transactional
    public void likeNote(User user, Long noteId) {
        if (likeRepository.existsByUserAndLikeableIdAndLikeableType(user, noteId, LikeableType.NOTE)) {
            throw new IllegalStateException("Note is already liked by the user");
        }

        // Verify note exists
        noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        Like like = new Like();
        like.setUser(user);
        like.setLikeableId(noteId);
        like.setLikeableType(LikeableType.NOTE);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikeNote(User user, Long noteId) {
        likeRepository.deleteByUserAndLikeableIdAndLikeableType(user, noteId, LikeableType.NOTE);
    }

    @Transactional
    public void likeRepository(User user, Long repositoryId) {
        if (likeRepository.existsByUserAndLikeableIdAndLikeableType(user, repositoryId, LikeableType.REPOSITORY)) {
            throw new IllegalStateException("Repository is already liked by the user");
        }

        // Verify repository exists
        repositoryRepository.findById(repositoryId)
            .orElseThrow(() -> new EntityNotFoundException("Repository not found"));

        Like like = new Like();
        like.setUser(user);
        like.setLikeableId(repositoryId);
        like.setLikeableType(LikeableType.REPOSITORY);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikeRepository(User user, Long repositoryId) {
        likeRepository.deleteByUserAndLikeableIdAndLikeableType(user, repositoryId, LikeableType.REPOSITORY);
    }

    public boolean hasUserLikedNote(User user, Long noteId) {
        return likeRepository.existsByUserAndLikeableIdAndLikeableType(user, noteId, LikeableType.NOTE);
    }

    public boolean hasUserLikedRepository(User user, Long repositoryId) {
        return likeRepository.existsByUserAndLikeableIdAndLikeableType(user, repositoryId, LikeableType.REPOSITORY);
    }

    public List<Like> getUserLikes(User user) {
        return likeRepository.findByUser(user);
    }

    public long getNoteLikeCount(Long noteId) {
        return likeRepository.findByLikeableIdAndLikeableType(noteId, LikeableType.NOTE).size();
    }

    public long getRepositoryLikeCount(Long repositoryId) {
        return likeRepository.findByLikeableIdAndLikeableType(repositoryId, LikeableType.REPOSITORY).size();
    }
} 