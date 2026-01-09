package org.homecodecarx.car.listing.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarImageResponse {
    private UUID id;
    private UUID listingId;
    private String imageUrl;
    private Integer position;
}
