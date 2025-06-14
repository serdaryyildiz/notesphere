package com.notesphere.service;

import com.notesphere.dto.note.NoteRequest;
import com.notesphere.dto.note.NoteResponse;
import com.notesphere.model.Note;
import com.notesphere.model.NoteRepository;
import com.notesphere.model.User;
import com.notesphere.model.Visibility;
import com.notesphere.model.SharedNote;
import com.notesphere.model.PermissionType;
import com.notesphere.model.Like;
import com.notesphere.model.LikeableType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
public class NoteService {
    private final com.notesphere.repository.NoteRepository noteRepository;
    private final com.notesphere.repository.UserRepository userRepository;
    private final com.notesphere.repository.RepositoryRepository repositoryRepository;
    private final com.notesphere.repository.SharedNoteRepository sharedNoteRepository;

    public NoteService(com.notesphere.repository.NoteRepository noteRepository,
                      com.notesphere.repository.UserRepository userRepository,
                      com.notesphere.repository.RepositoryRepository repositoryRepository,
                      com.notesphere.repository.SharedNoteRepository sharedNoteRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.repositoryRepository = repositoryRepository;
        this.sharedNoteRepository = sharedNoteRepository;
    }

    public NoteResponse createNote(NoteRequest noteRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Note note = new Note();
        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setCreator(user);
        note.setVisibility(noteRequest.isPublic() ? Visibility.PUBLIC : Visibility.PRIVATE);

        if (noteRequest.getRepositoryId() != null) {
            NoteRepository repository = repositoryRepository.findById(noteRequest.getRepositoryId())
                    .orElseThrow(() -> new RuntimeException("Repository not found"));
            note.getRepositories().add(repository);
        }

        Note savedNote = noteRepository.save(note);
        return convertToNoteResponse(savedNote, username);
    }

    public NoteResponse updateNote(Long noteId, NoteRequest noteRequest, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to update this note");
        }

        note.setTitle(noteRequest.getTitle());
        note.setContent(noteRequest.getContent());
        note.setVisibility(noteRequest.isPublic() ? Visibility.PUBLIC : Visibility.PRIVATE);

        if (noteRequest.getRepositoryId() != null) {
            NoteRepository repository = repositoryRepository.findById(noteRequest.getRepositoryId())
                    .orElseThrow(() -> new RuntimeException("Repository not found"));
            note.getRepositories().add(repository);
        } else {
            note.getRepositories().clear();
        }

        Note updatedNote = noteRepository.save(note);
        return convertToNoteResponse(updatedNote, username);
    }

    public void deleteNote(Long noteId, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this note");
        }

        note.setDeletedAt(LocalDateTime.now());
        noteRepository.save(note);
    }

    public Page<NoteResponse> getUserNotes(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return noteRepository.findByCreator(user, pageable)
                .map(note -> convertToNoteResponse(note, username));
    }

    public Page<NoteResponse> getPublicNotes(Pageable pageable, String currentUsername) {
        return noteRepository.findByVisibility(Visibility.PUBLIC, pageable)
                .map(note -> convertToNoteResponse(note, currentUsername));
    }

    @Transactional
    public void toggleLike(Long noteId, String username) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        boolean hasLiked = note.getLikes().stream()
                .anyMatch(like -> like.getUser().equals(user));

        if (hasLiked) {
            note.getLikes().removeIf(like -> like.getUser().equals(user));
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setLikeableId(note.getId());
            like.setLikeableType(LikeableType.NOTE);
            note.getLikes().add(like);
        }

        noteRepository.save(note);
    }

    private NoteResponse convertToNoteResponse(Note note, String currentUsername) {
        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setTitle(note.getTitle());
        response.setContent(note.getContent());
        response.setCreatorUsername(note.getCreator().getUsername());
        response.setVisibility(note.getVisibility());
        response.setLikesCount(note.getLikes().size());
        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());

        response.setRepositoryIds(note.getRepositories().stream()
                .map(NoteRepository::getId)
                .collect(Collectors.toList()));
        response.setRepositoryNames(note.getRepositories().stream()
                .map(NoteRepository::getName)
                .collect(Collectors.toList()));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElse(null);
        if (currentUser != null) {
            response.setLikedByCurrentUser(note.getLikes().contains(currentUser));
        }

        return response;
    }

    @Transactional
    public Note createNote(User creator, String title, String content, Visibility visibility) {
        Note note = new Note();
        note.setCreator(creator);
        note.setTitle(title);
        note.setContent(content);
        note.setVisibility(visibility);
        return noteRepository.save(note);
    }

    @Transactional
    public Note updateNote(User user, Long noteId, String title, String content, Visibility visibility) {
        Note note = getNoteWithAccessCheck(user, noteId, PermissionType.WRITE);
        note.setTitle(title);
        note.setContent(content);
        note.setVisibility(visibility);
        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(User user, Long noteId) {
        Note note = getNoteWithAccessCheck(user, noteId, PermissionType.WRITE);
        
        // Soft delete
        note.setDeletedAt(LocalDateTime.now());
        noteRepository.save(note);
    }

    public Note getNote(User user, Long noteId) {
        return getNoteWithAccessCheck(user, noteId, PermissionType.READ);
    }

    public List<Note> getUserNotes(User user) {
        return noteRepository.findByCreator(user);
    }

    public List<Note> getSharedWithUserNotes(User user) {
        return noteRepository.findSharedWithUser(user);
    }

    public List<Note> searchNotes(User user, String searchTerm) {
        return noteRepository.searchNotes(searchTerm, user);
    }

    @Transactional
    public void shareNote(User owner, Long noteId, User targetUser, PermissionType permission) {
        Note note = getNoteWithAccessCheck(owner, noteId, PermissionType.WRITE);
        
        if (sharedNoteRepository.existsByNoteAndSharedWithUser(note, targetUser)) {
            throw new IllegalStateException("Note is already shared with this user");
        }

        SharedNote sharedNote = new SharedNote();
        sharedNote.setNote(note);
        sharedNote.setSharedWithUser(targetUser);
        sharedNote.setPermissionType(permission);
        sharedNoteRepository.save(sharedNote);
    }

    @Transactional
    public void unshareNote(User owner, Long noteId, User targetUser) {
        Note note = getNoteWithAccessCheck(owner, noteId, PermissionType.WRITE);
        sharedNoteRepository.deleteByNoteAndSharedWithUser(note, targetUser);
    }

    @Transactional
    public void updateNotePermission(User owner, Long noteId, User targetUser, PermissionType newPermission) {
        Note note = getNoteWithAccessCheck(owner, noteId, PermissionType.WRITE);
        
        SharedNote sharedNote = sharedNoteRepository.findByNoteAndSharedWithUser(note, targetUser)
            .orElseThrow(() -> new EntityNotFoundException("Note is not shared with this user"));
        
        sharedNote.setPermissionType(newPermission);
        sharedNoteRepository.save(sharedNote);
    }

    private Note getNoteWithAccessCheck(User user, Long noteId, PermissionType requiredPermission) {
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new EntityNotFoundException("Note not found"));

        // Check if user is the creator
        if (note.getCreator().equals(user)) {
            return note;
        }

        // Check if note is public and read permission is required
        if (note.getVisibility() == Visibility.PUBLIC && requiredPermission == PermissionType.READ) {
            return note;
        }

        // Check shared access
        SharedNote sharedNote = sharedNoteRepository.findByNoteAndSharedWithUser(note, user)
            .orElseThrow(() -> new IllegalStateException("User does not have access to this note"));

        if (requiredPermission == PermissionType.WRITE && sharedNote.getPermissionType() != PermissionType.WRITE) {
            throw new IllegalStateException("User does not have write permission for this note");
        }

        return note;
    }
} 