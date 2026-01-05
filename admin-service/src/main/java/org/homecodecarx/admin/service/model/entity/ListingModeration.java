package org.homecodecarx.admin.service.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.homecodecarx.admin.service.model.enums.ModerationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ListingModeration {

    @Id
    private UUID id;
    private UUID listingId;
    private UUID adminId;
    private String comment;
    @Enumerated(EnumType.STRING)
    private ModerationStatus status;
    private LocalDateTime moderatedAt;
}
