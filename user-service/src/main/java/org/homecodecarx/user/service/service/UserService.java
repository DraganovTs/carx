package org.homecodecarx.user.service.service;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.homecodecarx.user.service.constants.Constants;
import org.homecodecarx.user.service.exception.PasswordNotMatchException;
import org.homecodecarx.user.service.exception.UserAlreadyExistException;
import org.homecodecarx.user.service.exception.UserNotFoundException;
import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.AuthResponse;
import org.homecodecarx.user.service.model.dto.LoginRequest;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(@Valid RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistException("User already exists with email: " + request.getEmail());
        }

        User user = userMapper.mapUserRequestToUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);


        return generateAuthResponse(user, Constants.REGISTRATION_SUCCESSFUL.name());
    }

    @Transactional
    public AuthResponse authenticate(@Valid LoginRequest request) {

        User user = findUserByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new PasswordNotMatchException("Invalid email or password!");
        }

        return generateAuthResponse(user, Constants.LOGIN_SUCCESSFUL.name());
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    private AuthResponse generateAuthResponse(User user, String message) {
        String token = jwtService.generateToken(user.getEmail(), user.getId().toString());
        return userMapper.mapUserToAuthResponse(user, message, token);
    }
}
