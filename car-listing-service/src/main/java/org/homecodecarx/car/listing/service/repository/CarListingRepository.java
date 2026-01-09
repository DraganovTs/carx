package org.homecodecarx.car.listing.service.repository;

import org.homecodecarx.car.listing.service.model.entity.CarListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CarListingRepository extends JpaRepository<CarListing, UUID> {
}
