package org.homecodecarx.admin.service.service;

import jakarta.transaction.Transactional;
import org.homecodecarx.admin.service.event.publisher.CarListingEventPublisher;
import org.homecodecarx.admin.service.exception.ListingModerationNotFoundException;
import org.homecodecarx.admin.service.mapper.ListingModerationMapper;
import org.homecodecarx.admin.service.model.dto.ListingModerationDTO;
import org.homecodecarx.admin.service.model.entity.ListingModeration;
import org.homecodecarx.admin.service.model.enums.ModerationStatus;
import org.homecodecarx.admin.service.repository.ListingModerationRepository;
import org.homecodecarx.common.domain.events.CarListingApprovedEvent;
import org.homecodecarx.common.domain.events.CarListingRejectedEvent;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ModerationService {

    private final ListingModerationRepository listingModerationRepository;
    private final ListingModerationMapper listingModerationMapper;
    private final CarListingEventPublisher publisher;

    public ModerationService(ListingModerationRepository listingModerationRepository,
                             ListingModerationMapper listingModerationMapper, CarListingEventPublisher publisher) {
        this.listingModerationRepository = listingModerationRepository;
        this.listingModerationMapper = listingModerationMapper;
        this.publisher = publisher;
    }

    public List<ListingModerationDTO> getPending() {
        List<ListingModeration> byStatus = listingModerationRepository.findByStatus(ModerationStatus.PENDING);
        return byStatus
                .stream()
                .map(listingModerationMapper::mapListingModerationToListingModerationDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void approve(UUID id, UUID adminId, String comment) {
        ListingModeration listingModeration = getListingModerationById(id);


        listingModeration.approve(adminId, comment);
        listingModerationRepository.save(listingModeration);

        publisher.publish(new CarListingApprovedEvent(listingModeration.getListingId(), adminId, comment));
    }

    @Transactional
    public void reject(UUID id, UUID adminId, String reason) {
        ListingModeration listingModeration = getListingModerationById(id);
        listingModeration.reject(adminId, reason);
        listingModerationRepository.save(listingModeration);

        publisher.publish(new CarListingRejectedEvent(listingModeration.getListingId(), adminId, reason));
    }


    private ListingModeration getListingModerationById(UUID id) {
        return listingModerationRepository.findById(id)
                .orElseThrow(() -> new ListingModerationNotFoundException("Moderation entry not found whit id: " + id));
    }

    @Transactional
    public void submitForModeration(UUID listingId) {
        if (listingModerationRepository.existsById(listingId)) {
            throw new IllegalStateException("Listing already submitted for moderation");
        }

        ListingModeration listingModeration = ListingModeration.builder()
                .listingId(listingId)
                .status(ModerationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        //TODO add a event for notification
        listingModerationRepository.save(listingModeration);
    }
}
