package com.notesphere.controller;

import com.notesphere.dto.ErrorResponse;
import com.notesphere.dto.auth.JwtAuthenticationResponse;
import com.notesphere.dto.auth.LoginRequest;
import com.notesphere.dto.auth.SignUpRequest;
import com.notesphere.model.User;
import com.notesphere.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping({"/auth/test", "/api/auth/test"})
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @PostMapping({"/auth/signin", "/api/auth/signin"})
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthenticationResponse jwt = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwt);
    }

    @PostMapping({"/auth/signup", "/api/auth/signup"})
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            User user = authService.registerUser(signUpRequest);
            String jwt = authService.generateToken(user.getUsername());
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("An error occurred during signup process."));
        }
    }
} 