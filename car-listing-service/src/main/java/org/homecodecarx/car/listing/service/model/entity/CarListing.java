package org.homecodecarx.car.listing.service.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.*;
import org.homecodecarx.car.listing.service.model.enums.ListingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarListing {
    @Id
    private UUID id;
    private UUID sellerId;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer year;
    private Integer mileage;
    private String fuelType;
    private String gearbox;
    private String category;
    private String brand;
    private String model;
    private String location;
    @Enumerated(EnumType.STRING)
    private ListingStatus status;
    private LocalDateTime createdAt;
}
