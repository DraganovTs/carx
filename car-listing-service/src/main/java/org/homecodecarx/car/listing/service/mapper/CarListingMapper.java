package org.homecodecarx.car.listing.service.mapper;

import org.homecodecarx.car.listing.service.model.dto.CarListingResponse;
import org.homecodecarx.car.listing.service.model.dto.CreateCarListingRequest;
import org.homecodecarx.car.listing.service.model.entity.CarListing;
import org.homecodecarx.car.listing.service.model.enums.ListingStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class CarListingMapper {
    public CarListing mapCarListigRequestToCarListing(CreateCarListingRequest request) {
        return CarListing.builder()
                .sellerId(UUID.fromString(request.getSellerId()))
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .year(request.getYear())
                .mileage(request.getMileage())
                .fuelType(request.getFuelType())
                .gearbox(request.getGearbox())
                .category(request.getCategory())
                .brand(request.getBrand())
                .model(request.getModel())
                .location(request.getLocation())
                .status(ListingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public CarListingResponse mapCarListToCarListingresponse(CarListing carListing) {
        return CarListingResponse.builder()
                .id(carListing.getId())
                .title(carListing.getTitle())
                .description(carListing.getDescription())
                .price(carListing.getPrice())
                .year(carListing.getYear())
                .mileage(carListing.getMileage())
                .brand(carListing.getBrand())
                .model(carListing.getModel())
                .fuelType(carListing.getFuelType())
                .gearbox(carListing.getGearbox())
                .category(carListing.getCategory())
                .location(carListing.getLocation())
                .status(carListing.getStatus().toString())
                .createdAt(carListing.getCreatedAt())
                .build();
    }
}
