package org.homecodecarx.user.service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.homecodecarx.user.service.model.enums.Role;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    private UUID id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role;
}
