package org.homecodecarx.user.service.mapper;

import org.homecodecarx.user.service.model.dto.AuthResponse;
import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.dto.UserResponse;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.model.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User mapUserRequestToUser(RegisterRequest request) {
        return User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.BUYER)
                .build();
    }

    public AuthResponse mapUserToAuthResponse(User user, String message, String token) {
        return AuthResponse.builder()
                .userId(user.getId().toString())
                .email(user.getEmail())
                .message(message)
                .token(token)
                .build();
    }

    public UserResponse mapUserToUserResponse(User user) {
        return UserResponse.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole().toString())
                .build();
    }
}
