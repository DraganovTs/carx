package org.homecodecarx.admin.service.model.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListingModerationDTO {
    private UUID id;

    private UUID listingId;
    private UUID adminId;
    private UUID sellerId;

    private String comment;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime moderatedAt;
}
