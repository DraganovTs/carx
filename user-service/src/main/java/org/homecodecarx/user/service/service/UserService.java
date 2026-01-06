package org.homecodecarx.user.service.service;

import org.homecodecarx.user.service.mapper.UserMapper;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.repository.UserRepository;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }

        User user = userMapper.mapUserRequestToUser(request);

        return userRepository.save(user);
    }
}
