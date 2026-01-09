package org.homecodecarx.car.listing.service.service;

import org.homecodecarx.car.listing.service.model.entity.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CarImageRepository extends JpaRepository <CarImage, UUID>{
}
