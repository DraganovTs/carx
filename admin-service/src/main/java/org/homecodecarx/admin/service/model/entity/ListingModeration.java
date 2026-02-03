package org.homecodecarx.admin.service.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.homecodecarx.admin.service.model.enums.ModerationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@AllArgsConstructor
@Builder
public class ListingModeration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID listingId;
    private UUID adminId;
    private UUID sellerId;

    private String comment;
    @Enumerated(EnumType.STRING)
    private ModerationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime moderatedAt;


    protected ListingModeration() {}

    public ListingModeration(UUID listingId, UUID sellerId) {
        this.listingId = listingId;
        this.sellerId = sellerId;
        this.status = ModerationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public void approve(UUID adminId, String comment) {
        this.adminId = adminId;
        this.comment = comment;
        this.status = ModerationStatus.APPROVED;
        this.moderatedAt = LocalDateTime.now();
    }

    public void reject(UUID adminId, String comment) {
        this.adminId = adminId;
        this.comment = comment;
        this.status = ModerationStatus.REJECTED;
        this.moderatedAt = LocalDateTime.now();
    }
}
