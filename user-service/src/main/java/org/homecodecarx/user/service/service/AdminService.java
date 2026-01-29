package org.homecodecarx.user.service.service;

import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.UserResponse;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

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

        Page<User> users;

        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.searchUsers(search.trim(),pageable);
        }else {
            users = userRepository.findAll(pageable);
        }
        return users.map(userMapper::mapUserToUserResponse);
    }
}
