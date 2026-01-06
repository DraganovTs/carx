package org.homecodecarx.user.service.controller;

import jakarta.validation.Valid;
import org.homecodecarx.user.service.model.dto.AuthResponse;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {

        try {
            User user = userService.register(request);

            AuthResponse response = AuthResponse.builder()
                    .message("User registered successfully")
                    .email(user.getEmail())
                    .userId(user.getId().toString())
                    .token("dummy-token")
                    .build();

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            AuthResponse errorResponse = AuthResponse.builder()
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<?> login() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@RequestParam UUID id) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        return ResponseEntity.ok().build();
    }
}
