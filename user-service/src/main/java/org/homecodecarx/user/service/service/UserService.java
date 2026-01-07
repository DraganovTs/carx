package org.homecodecarx.user.service.service;

import jakarta.transaction.Transactional;
import org.homecodecarx.user.service.exception.UserAlreadyExistException;
import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.AuthResponse;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistException("User already exists with email: " + request.getEmail());
        }

        User user = userMapper.mapUserRequestToUser(request);
        user.setId(UUID.randomUUID());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return userMapper.mapUserToAuthResponse(user);
    }
}
