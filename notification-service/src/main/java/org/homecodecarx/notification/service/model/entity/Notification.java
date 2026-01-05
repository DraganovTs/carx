package org.homecodecarx.notification.service.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;
import org.homecodecarx.notification.service.model.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    private UUID id;
    private UUID userId;
    private String message;
    @Enumerated(EnumType.STRING)
    private NotificationType type;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
