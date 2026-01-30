package org.homecodecarx.user.service.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.homecodecarx.user.service.exception.InvalidRoleException;
import org.homecodecarx.user.service.exception.RoleRequiredException;
import org.homecodecarx.user.service.exception.UserNotFoundException;
import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.UserResponse;
import org.homecodecarx.user.service.model.dto.UserUpdateRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.model.enums.Role;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AdminService {

    private static final String ADMIN_ONLY = "hasRole('ADMIN')";

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AdminService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }


    @PreAuthorize(ADMIN_ONLY)
    public Page<UserResponse> getAllUsers(Pageable pageable, String search) {

        Page<User> users = (search == null || search.isBlank())
                ? userRepository.findAll(pageable)
                : userRepository.searchUsers(search.trim(), pageable);

        return users.map(userMapper::mapUserToUserResponse);
    }

    @PreAuthorize(ADMIN_ONLY)
    public UserResponse getUser(UUID id) {
        return userMapper.mapUserToUserResponse(
                userRepository.findById(id)
                        .orElseThrow(() -> new UserNotFoundException("User not found"))
        );
    }

    @PreAuthorize(ADMIN_ONLY)
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    @PreAuthorize(ADMIN_ONLY)
    @Transactional
    public UserResponse updateUser(UUID id, @Valid UserUpdateRequest request) {
        User user = findUserById(id);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);
        return userMapper.mapUserToUserResponse(user);
    }

    @Transactional
    @PreAuthorize(ADMIN_ONLY)
    public UserResponse updateUserRole(UUID id, String role) {
        User user = findUserById(id);
        Role updatedRole = parseRole(role);
        user.setRole(updatedRole);
        userRepository.save(user);
        return userMapper.mapUserToUserResponse(user);
    }


    private User findUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    private Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            throw new RoleRequiredException("Role must not be blank");
        }
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidRoleException("Unsupported role: " + role);
        }
    }
}
