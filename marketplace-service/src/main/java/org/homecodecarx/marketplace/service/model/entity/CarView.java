package org.homecodecarx.marketplace.service.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CarView {
    @Id
    private UUID id;
    private String title;
    private BigDecimal price;
    private String brand;
    private String model;
    private Integer year;
    private Integer mileage;
    private String location;
    private String mainImageUrl;
}
