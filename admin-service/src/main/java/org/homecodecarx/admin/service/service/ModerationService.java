package org.homecodecarx.admin.service.service;

import org.homecodecarx.admin.service.mapper.ListingModerationMapper;
import org.homecodecarx.admin.service.model.dto.ListingModerationDTO;
import org.homecodecarx.admin.service.model.entity.ListingModeration;
import org.homecodecarx.admin.service.model.enums.ModerationStatus;
import org.homecodecarx.admin.service.repository.ListingModerationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModerationService {

    private final ListingModerationRepository listingModerationRepository;
    private final ListingModerationMapper listingModerationMapper;

    public ModerationService(ListingModerationRepository listingModerationRepository,
                             ListingModerationMapper listingModerationMapper) {
        this.listingModerationRepository = listingModerationRepository;
        this.listingModerationMapper = listingModerationMapper;
    }

    public List<ListingModerationDTO> getPending() {
        List<ListingModeration> byStatus = listingModerationRepository.findByStatus(ModerationStatus.PENDING);
        return byStatus
                .stream()
                .map(listingModeration ->
                        listingModerationMapper::mapListingModerationToListingModerationDTO)
                .collect(Collectors.toList());
    }

    public void approve(UUID id, UUID adminId, String comment) {
        //TODO
    }

    public void reject(UUID id, UUID adminId, String reason) {
        //TODO
    }
}
