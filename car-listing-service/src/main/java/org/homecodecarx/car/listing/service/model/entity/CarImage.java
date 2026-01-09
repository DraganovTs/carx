package org.homecodecarx.car.listing.service.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "car_images")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private UUID listingId;
    private String imageUrl;
    private Integer position;
}
