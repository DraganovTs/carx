package org.homecodecarx.car.listing.service.service;

import org.homecodecarx.car.listing.service.exception.CarNotFoundException;
import org.homecodecarx.car.listing.service.mapper.CarListingMapper;
import org.homecodecarx.car.listing.service.mapper.ImageMapper;
import org.homecodecarx.car.listing.service.model.dto.CarImageResponse;
import org.homecodecarx.car.listing.service.model.dto.CarListingResponse;
import org.homecodecarx.car.listing.service.model.dto.CreateCarListingRequest;
import org.homecodecarx.car.listing.service.model.entity.CarImage;
import org.homecodecarx.car.listing.service.model.entity.CarListing;
import org.homecodecarx.car.listing.service.repository.CarImageRepository;
import org.homecodecarx.car.listing.service.repository.CarListingRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CarListingService {


    private final CarListingRepository carListingRepository;
    private final CarListingMapper carListingMapper;
    private final CarImageRepository carImageRepository;
    private final ImageMapper imageMapper;

    public CarListingService(CarListingRepository carListingRepository, CarListingMapper carListingMapper,
                             CarImageRepository carImageRepository, ImageMapper imageMapper) {
        this.carListingRepository = carListingRepository;
        this.carListingMapper = carListingMapper;
        this.carImageRepository = carImageRepository;
        this.imageMapper = imageMapper;
    }

    public CarListingResponse listCar(CreateCarListingRequest request) {


        CarListing carListing = carListingMapper.mapCarListigRequestToCarListing(request);

        carListingRepository.save(carListing);

        return carListingMapper.mapCarListToCarListingresponse(carListing);
    }

    public CarImageResponse addImage(UUID listingId, String imageUrl, int position) {

        CarListing carListing = carListingRepository.findById(listingId)
                .orElseThrow(() -> new CarNotFoundException("Car not found whit id: " + listingId));

        CarImage image = CarImage.builder()
                .listingId(listingId)
                .imageUrl(imageUrl)
                .position(position)
                .build();

        carImageRepository.save(image);

        return CarImageResponse.builder()
                .id(image.getId())
                .imageUrl(imageUrl)
                .position(position)
                .listingId(listingId)
                .build();
    }
}
