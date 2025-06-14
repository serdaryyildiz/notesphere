package com.notesphere.service;

import com.notesphere.model.Follow;
import com.notesphere.model.NoteRepository;
import com.notesphere.model.User;
import com.notesphere.model.Visibility;
import com.notesphere.repository.FollowRepository;
import com.notesphere.repository.RepositoryRepository;
import com.notesphere.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final RepositoryRepository repositoryRepository;

    public FollowService(FollowRepository followRepository, UserRepository userRepository, RepositoryRepository repositoryRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.repositoryRepository = repositoryRepository;
    }

    @Transactional
    public void followRepository(User follower, Long repositoryId) {
        if (followRepository.existsByFollowerAndFollowed(follower, getRepository(repositoryId))) {
            throw new IllegalStateException("User already follows this repository");
        }

        NoteRepository repository = getRepository(repositoryId);
        
        // Check if repository is public or user has access
        if (!repository.getVisibility().equals(Visibility.PUBLIC) && 
            !repository.getCreator().equals(follower)) {
            throw new IllegalStateException("Cannot follow private repository");
        }

        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowed(repository);
        followRepository.save(follow);
    }

    @Transactional
    public void unfollowRepository(User follower, Long repositoryId) {
        NoteRepository repository = getRepository(repositoryId);
        followRepository.deleteByFollowerAndFollowed(follower, repository);
    }

    public boolean isFollowing(User follower, Long repositoryId) {
        NoteRepository repository = getRepository(repositoryId);
        return followRepository.existsByFollowerAndFollowed(follower, repository);
    }

    public List<Follow> getUserFollows(User user) {
        return followRepository.findByFollower(user);
    }

    public List<Follow> getRepositoryFollowers(Long repositoryId) {
        NoteRepository repository = getRepository(repositoryId);
        return followRepository.findByFollowed(repository);
    }

    public long getFollowerCount(Long repositoryId) {
        NoteRepository repository = getRepository(repositoryId);
        return followRepository.findByFollowed(repository).size();
    }

    private NoteRepository getRepository(Long repositoryId) {
        return repositoryRepository.findById(repositoryId)
            .orElseThrow(() -> new EntityNotFoundException("Repository not found"));
    }

    @Transactional
    public void toggleFollow(Long repositoryId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        NoteRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        if (followRepository.existsByFollowerAndFollowed(user, repository)) {
            followRepository.deleteByFollowerAndFollowed(user, repository);
        } else {
            Follow follow = new Follow();
            follow.setFollower(user);
            follow.setFollowed(repository);
            followRepository.save(follow);
        }
    }
} 