package org.homecodecarx.car.listing.service.controller;

import org.homecodecarx.car.listing.service.model.dto.CarImageResponse;
import org.homecodecarx.car.listing.service.model.dto.CarListingResponse;
import org.homecodecarx.car.listing.service.model.dto.CreateCarListingRequest;
import org.homecodecarx.car.listing.service.service.CarListingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping(value = "/{id}/images" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarImageResponse> uploadImage(
            @PathVariable("id") String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "0") int position
    ) throws IOException {



        return ResponseEntity.ok(carListingService.addImage(id, file, position));
    }

    @PostMapping(value = "/{id}/submit")
    public ResponseEntity<Void>submit(@PathVariable("id") String listingId){
        carListingService.submitForApproval(listingId);
        return ResponseEntity.ok().build();
    }



}
