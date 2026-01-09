package org.homecodecarx.car.listing.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateCarListingRequest {

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
}
