package com.notesphere.controller;

import com.notesphere.dto.repository.RepositoryRequest;
import com.notesphere.dto.repository.RepositoryResponse;
import com.notesphere.service.RepositoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repositories")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RepositoryController {

    @Autowired
    private RepositoryService repositoryService;

    @GetMapping("/all")
    public ResponseEntity<Page<RepositoryResponse>> getAllRepositories(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Page<RepositoryResponse> repositories = repositoryService.getAllRepositories(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/me")
    public ResponseEntity<Page<RepositoryResponse>> getUserRepositories(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Page<RepositoryResponse> repositories = repositoryService.getUserRepositories(userDetails.getUsername(), pageable);
        return ResponseEntity.ok(repositories);
    }

    @GetMapping("/public")
    public ResponseEntity<Page<RepositoryResponse>> getPublicRepositories(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Page<RepositoryResponse> repositories = repositoryService.getPublicRepositories(pageable, userDetails.getUsername());
        return ResponseEntity.ok(repositories);
    }

    @PostMapping
    public ResponseEntity<RepositoryResponse> createRepository(
            @Valid @RequestBody RepositoryRequest repositoryRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        RepositoryResponse repository = repositoryService.createRepository(repositoryRequest, userDetails.getUsername());
        return ResponseEntity.ok(repository);
    }

    @PutMapping("/{repositoryId}")
    public ResponseEntity<RepositoryResponse> updateRepository(
            @PathVariable Long repositoryId,
            @Valid @RequestBody RepositoryRequest repositoryRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        RepositoryResponse repository = repositoryService.updateRepository(repositoryId, repositoryRequest, userDetails.getUsername());
        return ResponseEntity.ok(repository);
    }

    @DeleteMapping("/{repositoryId}")
    public ResponseEntity<?> deleteRepository(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        repositoryService.deleteRepository(repositoryId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{repositoryId}/follow")
    public ResponseEntity<?> toggleFollow(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        repositoryService.toggleFollow(repositoryId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{repositoryId}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long repositoryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        repositoryService.toggleLike(repositoryId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
} 