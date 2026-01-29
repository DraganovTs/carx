package org.homecodecarx.user.service.service;

import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.UserResponse;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AdminService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }


//    @PreAuthorize("hasRole('ADMIN')")
public Page<UserResponse> getAllUsers(Pageable pageable, String search) {
    System.out.println("=== AdminService.getAllUsers ===");
    System.out.println("Pageable: " + pageable);
    System.out.println("Search: '" + search + "'");

    try {
        Page<User> users;

        if (search != null && !search.trim().isEmpty()) {
            String searchTerm = search.trim().toLowerCase();
            System.out.println("Searching for: '" + searchTerm + "'");

            // Try different query methods
            try {
                // Method 1: Try the query method
                users = userRepository.searchUsers(searchTerm, pageable);
                System.out.println("Method 1 (searchUsers) successful");
            } catch (Exception e1) {
                System.err.println("Method 1 failed: " + e1.getMessage());
                System.out.println("Trying alternative method...");

                // Method 2: Try findAll and filter manually (as fallback)
                List<User> allUsers = userRepository.findAll();
                List<User> filteredUsers = allUsers.stream()
                        .filter(user ->
                                user.getEmail().toLowerCase().contains(searchTerm) ||
                                        user.getFirstName().toLowerCase().contains(searchTerm) ||
                                        user.getLastName().toLowerCase().contains(searchTerm))
                        .collect(Collectors.toList());

                // Manual pagination
                int start = (int) pageable.getOffset();
                int end = Math.min((start + pageable.getPageSize()), filteredUsers.size());
                List<User> pageContent = filteredUsers.subList(start, end);

                users = new PageImpl<>(pageContent, pageable, filteredUsers.size());
                System.out.println("Method 2 (manual filtering) successful");
            }
        } else {
            System.out.println("No search term, using findAll");
            users = userRepository.findAll(pageable);
        }

        System.out.println("Found " + users.getTotalElements() + " users");

        // Map to response
        Page<UserResponse> response = users.map(userMapper::mapUserToUserResponse);
        System.out.println("Mapping successful");

        return response;

    } catch (Exception e) {
        System.err.println("=== ERROR in getAllUsers ===");
        System.err.println("Error: " + e.getClass().getName() + ": " + e.getMessage());
        e.printStackTrace();
        throw new RuntimeException("Failed to get users: " + e.getMessage(), e);
    }
}
}
