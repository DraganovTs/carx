package org.homecodecarx.car.listing.service.service;

import org.homecodecarx.car.listing.service.events.SimpleEventPublisher;
import org.homecodecarx.car.listing.service.exception.CarNotFoundException;
import org.homecodecarx.car.listing.service.mapper.CarListingMapper;
import org.homecodecarx.car.listing.service.mapper.ImageMapper;
import org.homecodecarx.car.listing.service.model.dto.CarImageResponse;
import org.homecodecarx.car.listing.service.model.dto.CarListingResponse;
import org.homecodecarx.car.listing.service.model.dto.CreateCarListingRequest;
import org.homecodecarx.car.listing.service.model.entity.CarImage;
import org.homecodecarx.car.listing.service.model.entity.CarListing;
import org.homecodecarx.car.listing.service.model.enums.ListingStatus;
import org.homecodecarx.car.listing.service.repository.CarImageRepository;
import org.homecodecarx.car.listing.service.repository.CarListingRepository;
import org.homecodecarx.common.domain.DomainEventPublisher;
import org.homecodecarx.common.domain.events.CarListingSubmittedEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class CarListingService {


    private final CarListingRepository carListingRepository;
    private final CarListingMapper carListingMapper;
    private final CarImageRepository carImageRepository;
    private final ImageMapper imageMapper;
    private final SimpleEventPublisher publisher;


    public CarListingService(CarListingRepository carListingRepository, CarListingMapper carListingMapper,
                             CarImageRepository carImageRepository, ImageMapper imageMapper, DomainEventPublisher publisher, SimpleEventPublisher publisher1) {
        this.carListingRepository = carListingRepository;
        this.carListingMapper = carListingMapper;
        this.carImageRepository = carImageRepository;
        this.imageMapper = imageMapper;

        this.publisher = publisher1;
    }

    public CarListingResponse listCar(CreateCarListingRequest request) {


        CarListing carListing = carListingMapper.mapCarListigRequestToCarListing(request);

        carListingRepository.save(carListing);

        return carListingMapper.mapCarListToCarListingresponse(carListing);
    }

    @Transactional
    public CarImageResponse addImage(String listingId, MultipartFile file, int position) throws IOException {

        CarListing carListing = getCarListingById(UUID.fromString(listingId));

        Path uploadDir = Paths.get("uploads/cars/" + carListing.getId().toString());
        Files.createDirectories(uploadDir);

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String imageUrl = "http://localhost:8081/uploads/cars/" + listingId + "/" + fileName;

        CarImage image = CarImage.builder()
                .listingId(UUID.fromString(listingId))
                .imageUrl(imageUrl)
                .position(position)
                .build();

        carImageRepository.save(image);

        submitForApproval(UUID.fromString(listingId));

        return CarImageResponse.builder()
                .id(image.getId())
                .imageUrl(imageUrl)
                .position(position)
                .listingId(UUID.fromString(listingId))
                .build();
    }

    @Transactional
    public void submitForApproval(UUID listingId) {
        CarListing carListing = getCarListingById(listingId);

        carListing.setStatus(ListingStatus.SUBMIT_FOR_APPROVAL);
        carListingRepository.save(carListing);
        publisher.publish(new CarListingSubmittedEvent(listingId));

    }

    private CarListing getCarListingById(UUID listingId) {
        return carListingRepository.findById(listingId)
                .orElseThrow(() -> new CarNotFoundException("Car not found whit id: " + listingId));
    }
    
    


}
