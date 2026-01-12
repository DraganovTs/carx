package org.homecodecarx.car.listing.service.controller;

import org.homecodecarx.car.listing.service.model.dto.CarImageResponse;
import org.homecodecarx.car.listing.service.model.dto.CarListingResponse;
import org.homecodecarx.car.listing.service.model.dto.CreateCarListingRequest;
import org.homecodecarx.car.listing.service.service.CarListingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(value = "/api/car-listing" , produces = MediaType.APPLICATION_JSON_VALUE)
public class CarListingController {


    private final CarListingService carListingService;

    public CarListingController(CarListingService carListingService) {
        this.carListingService = carListingService;
    }

    @PostMapping
    public ResponseEntity<CarListingResponse> create(@RequestBody CreateCarListingRequest request){

        System.out.println(request.toString());

        CarListingResponse response = carListingService.listCar(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<CarImageResponse> uploadImage(
            @PathVariable("id") UUID listingId,
            @RequestBody String imageUrl,
            @RequestParam(defaultValue = "0") int position
    ) {

        System.out.println(listingId);
        System.out.println(imageUrl);


        return ResponseEntity.ok(carListingService.addImage(listingId, imageUrl, position));
    }



}
