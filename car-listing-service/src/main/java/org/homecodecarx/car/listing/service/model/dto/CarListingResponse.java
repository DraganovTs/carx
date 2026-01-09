package org.homecodecarx.car.listing.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.homecodecarx.car.listing.service.model.enums.ListingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CarListingResponse {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer year;
    private Integer mileage;
    private String brand;
    private String model;
    private String fuelType;
    private String gearbox;
    private String category;
    private String location;
    private String status;
    private LocalDateTime createdAt;
}
