package org.homecodecarx.admin.service.mapper;

import org.homecodecarx.admin.service.model.dto.ListingModerationDTO;
import org.homecodecarx.admin.service.model.entity.ListingModeration;
import org.springframework.stereotype.Component;

@Component
public class ListingModerationMapper {

    public ListingModerationDTO mapListingModerationToListingModerationDTO(ListingModeration listingModeration) {
        return ListingModerationDTO.builder()
                .id(listingModeration.getId())
                .listingId(listingModeration.getListingId())
                .adminId(listingModeration.getAdminId())
                .sellerId(listingModeration.getSellerId())
                .status(listingModeration.getStatus().toString())
                .build();
    }
}
