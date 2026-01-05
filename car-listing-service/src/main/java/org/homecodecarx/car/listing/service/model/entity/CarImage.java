package org.homecodecarx.car.listing.service.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarImage {

    @Id
    private UUID id;
    private UUID listingId;
    private String imageUrl;
    private Integer position;
}
