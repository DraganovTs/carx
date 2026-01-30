package org.homecodecarx.user.service.service;

import org.homecodecarx.user.service.exception.UserNotFoundException;
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
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AdminService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }


    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserResponse> getAllUsers(Pageable pageable, String search) {

        Page<User> users = (search == null || search.isBlank())
                ? userRepository.findAll(pageable)
                : userRepository.searchUsers(search.trim(), pageable);

        return users.map(userMapper::mapUserToUserResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse getUser(UUID id) {
        return userMapper.mapUserToUserResponse(
                userRepository.findById(id)
                        .orElseThrow(() -> new UserNotFoundException("User not found"))
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
}
