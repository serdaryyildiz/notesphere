package com.notesphere.service;

import com.notesphere.dto.repository.RepositoryRequest;
import com.notesphere.dto.repository.RepositoryResponse;
import com.notesphere.model.NoteRepository;
import com.notesphere.model.Note;
import com.notesphere.model.User;
import com.notesphere.model.Visibility;
import com.notesphere.model.SharedRepository;
import com.notesphere.model.PermissionType;
import com.notesphere.model.Like;
import com.notesphere.model.LikeableType;
import com.notesphere.model.Follow;
import com.notesphere.repository.RepositoryRepository;
import com.notesphere.repository.UserRepository;
import com.notesphere.repository.SharedRepositoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageImpl;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class RepositoryService {
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private final SharedRepositoryRepository sharedRepositoryRepository;
    private final com.notesphere.repository.NoteRepository noteRepository;

    public RepositoryService(RepositoryRepository repositoryRepository,
                           UserRepository userRepository,
                           SharedRepositoryRepository sharedRepositoryRepository,
                           com.notesphere.repository.NoteRepository noteRepository) {
        this.repositoryRepository = repositoryRepository;
        this.userRepository = userRepository;
        this.sharedRepositoryRepository = sharedRepositoryRepository;
        this.noteRepository = noteRepository;
    }

    public RepositoryResponse createRepository(RepositoryRequest repositoryRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        NoteRepository repository = new NoteRepository();
        repository.setName(repositoryRequest.getName());
        repository.setDescription(repositoryRequest.getDescription());
        repository.setCreator(user);
        repository.setVisibility(repositoryRequest.isPublic() ? Visibility.PUBLIC : Visibility.PRIVATE);

        NoteRepository savedRepository = repositoryRepository.save(repository);
        return convertToRepositoryResponse(savedRepository);
    }

    public RepositoryResponse updateRepository(Long repositoryId, RepositoryRequest repositoryRequest, String username) {
        NoteRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        if (!repository.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to update this repository");
        }

        repository.setName(repositoryRequest.getName());
        repository.setDescription(repositoryRequest.getDescription());
        repository.setVisibility(repositoryRequest.isPublic() ? Visibility.PUBLIC : Visibility.PRIVATE);

        NoteRepository updatedRepository = repositoryRepository.save(repository);
        return convertToRepositoryResponse(updatedRepository);
    }

    public void deleteRepository(Long repositoryId, String username) {
        NoteRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        if (!repository.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this repository");
        }

        repositoryRepository.delete(repository);
    }

    public Page<RepositoryResponse> getUserRepositories(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return repositoryRepository.findByCreator(user, pageable)
                .map(repository -> convertToRepositoryResponse(repository));
    }

    public Page<RepositoryResponse> getPublicRepositories(Pageable pageable, String currentUsername) {
        return repositoryRepository.findByVisibility(Visibility.PUBLIC, pageable)
                .map(repository -> convertToRepositoryResponse(repository));
    }

    @Transactional
    public void toggleFollow(Long repositoryId, String username) {
        NoteRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean isFollowing = repository.getFollowers().stream()
                .anyMatch(follow -> follow.getFollower().equals(user));

        if (isFollowing) {
            repository.getFollowers().removeIf(follow -> follow.getFollower().equals(user));
        } else {
            Follow follow = new Follow();
            follow.setFollower(user);
            follow.setFollowed(repository);
            repository.getFollowers().add(follow);
        }

        repositoryRepository.save(repository);
    }

    @Transactional
    public void toggleLike(Long repositoryId, String username) {
        NoteRepository repository = repositoryRepository.findById(repositoryId)
                .orElseThrow(() -> new RuntimeException("Repository not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean hasLiked = repository.getLikes().stream()
                .anyMatch(like -> like.getUser().equals(user));

        if (hasLiked) {
            repository.getLikes().removeIf(like -> like.getUser().equals(user));
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setLikeableId(repository.getId());
            like.setLikeableType(LikeableType.REPOSITORY);
            repository.getLikes().add(like);
        }

        repositoryRepository.save(repository);
    }

    private RepositoryResponse convertToRepositoryResponse(NoteRepository repository) {
        RepositoryResponse response = new RepositoryResponse();
        response.setId(repository.getId());
        response.setName(repository.getName());
        response.setDescription(repository.getDescription());
        response.setCreatorUsername(repository.getCreator().getUsername());
        response.setVisibility(repository.getVisibility());
        response.setNotesCount(repository.getNotes().size());
        response.setCreatedAt(repository.getCreatedAt());
        response.setUpdatedAt(repository.getUpdatedAt());
        return response;
    }

    @Transactional
    public NoteRepository createRepository(User creator, String name, String description, Visibility visibility) {
        NoteRepository repository = new NoteRepository();
        repository.setCreator(creator);
        repository.setName(name);
        repository.setDescription(description);
        repository.setVisibility(visibility);
        return repositoryRepository.save(repository);
    }

    @Transactional
    public NoteRepository updateRepository(User user, Long repositoryId, String name, String description, Visibility visibility) {
        NoteRepository repository = getRepositoryWithAccessCheck(user, repositoryId, PermissionType.WRITE);
        repository.setName(name);
        repository.setDescription(description);
        repository.setVisibility(visibility);
        return repositoryRepository.save(repository);
    }

    @Transactional
    public void deleteRepository(User user, Long repositoryId) {
        NoteRepository repository = getRepositoryWithAccessCheck(user, repositoryId, PermissionType.WRITE);
        
        // Soft delete
        repository.setDeletedAt(LocalDateTime.now());
        repositoryRepository.save(repository);
    }

    public NoteRepository getRepository(User user, Long repositoryId) {
        return getRepositoryWithAccessCheck(user, repositoryId, PermissionType.READ);
    }

    public List<NoteRepository> getUserRepositories(User user) {
        return repositoryRepository.findByCreator(user);
    }

    public List<NoteRepository> getSharedWithUserRepositories(User user) {
        return repositoryRepository.findSharedWithUser(user);
    }

    public List<NoteRepository> searchRepositories(User user, String searchTerm) {
        return repositoryRepository.searchRepositories(searchTerm, user);
    }

    @Transactional
    public void addNoteToRepository(User user, Long repositoryId, Long noteId) {
        NoteRepository repository = getRepositoryWithAccessCheck(user, repositoryId, PermissionType.WRITE);
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        if (!note.getCreator().equals(user) && note.getVisibility() != Visibility.PUBLIC) {
            throw new IllegalStateException("User does not have access to this note");
        }

        repository.getNotes().add(note);
        repositoryRepository.save(repository);
    }

    @Transactional
    public void removeNoteFromRepository(User user, Long repositoryId, Long noteId) {
        NoteRepository repository = getRepositoryWithAccessCheck(user, repositoryId, PermissionType.WRITE);
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        repository.getNotes().remove(note);
        repositoryRepository.save(repository);
    }

    @Transactional
    public void shareRepository(User owner, Long repositoryId, User targetUser, PermissionType permission) {
        NoteRepository repository = getRepositoryWithAccessCheck(owner, repositoryId, PermissionType.WRITE);
        
        if (sharedRepositoryRepository.existsByRepositoryAndSharedWithUser(repository, targetUser)) {
            throw new IllegalStateException("Repository is already shared with this user");
        }

        SharedRepository sharedRepository = new SharedRepository();
        sharedRepository.setRepository(repository);
        sharedRepository.setSharedWithUser(targetUser);
        sharedRepository.setPermissionType(permission);
        sharedRepositoryRepository.save(sharedRepository);
    }

    @Transactional
    public void unshareRepository(User owner, Long repositoryId, User targetUser) {
        NoteRepository repository = getRepositoryWithAccessCheck(owner, repositoryId, PermissionType.WRITE);
        sharedRepositoryRepository.deleteByRepositoryAndSharedWithUser(repository, targetUser);
    }

    @Transactional
    public void updateRepositoryPermission(User owner, Long repositoryId, User targetUser, PermissionType newPermission) {
        NoteRepository repository = getRepositoryWithAccessCheck(owner, repositoryId, PermissionType.WRITE);
        
        SharedRepository sharedRepository = sharedRepositoryRepository.findByRepositoryAndSharedWithUser(repository, targetUser)
            .orElseThrow(() -> new EntityNotFoundException("Repository is not shared with this user"));
        
        sharedRepository.setPermissionType(newPermission);
        sharedRepositoryRepository.save(sharedRepository);
    }

    private NoteRepository getRepositoryWithAccessCheck(User user, Long repositoryId, PermissionType requiredPermission) {
        NoteRepository repository = repositoryRepository.findById(repositoryId)
            .orElseThrow(() -> new EntityNotFoundException("Repository not found"));

        if (repository.getCreator().equals(user)) {
            return repository;
        }

        if (repository.getVisibility() == Visibility.PUBLIC && requiredPermission == PermissionType.READ) {
            return repository;
        }

        SharedRepository sharedRepository = sharedRepositoryRepository.findByRepositoryAndSharedWithUser(repository, user)
            .orElseThrow(() -> new IllegalStateException("User does not have access to this repository"));

        if (requiredPermission == PermissionType.WRITE && sharedRepository.getPermissionType() != PermissionType.WRITE) {
            throw new IllegalStateException("User does not have write permission for this repository");
        }

        return repository;
    }

    public Page<RepositoryResponse> getAllRepositories(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Page<NoteRepository> myRepos = repositoryRepository.findByCreator(user, pageable);
        
        Page<NoteRepository> sharedRepos = repositoryRepository.findByVisibility(Visibility.PUBLIC, pageable);
        
        List<NoteRepository> allRepos = new ArrayList<>();
        allRepos.addAll(myRepos.getContent());
        allRepos.addAll(sharedRepos.getContent());
        
        allRepos = allRepos.stream()
                .distinct()
                .collect(Collectors.toList());
        
        List<RepositoryResponse> responses = allRepos.stream()
                .map(this::convertToRepositoryResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, responses.size());
    }
} 