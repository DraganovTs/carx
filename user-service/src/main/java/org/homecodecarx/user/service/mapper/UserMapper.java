package org.homecodecarx.user.service.mapper;

import org.homecodecarx.user.service.model.dto.RegisterRequest;
import org.homecodecarx.user.service.model.entity.User;
import org.homecodecarx.user.service.model.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;

    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public User mapUserRequestToUser(RegisterRequest request) {
        return User.builder()
                .id(UUID.randomUUID())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.BUYER)
                .build();
    }
}
