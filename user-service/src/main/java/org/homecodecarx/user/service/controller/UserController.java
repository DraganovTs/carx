package org.homecodecarx.user.service.controller;

import jakarta.validation.Valid;
import org.homecodecarx.user.service.model.dto.AuthResponse;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.service.UserService;
import org.springframework.http.HttpStatus;
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
            AuthResponse response = userService.register(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
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
