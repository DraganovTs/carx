package org.homecodecarx.admin.service.event.handler;

import org.homecodecarx.admin.service.service.ModerationService;
import org.homecodecarx.common.domain.events.CarListingSubmittedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class ModerationEventHandler {

    private final ModerationService moderationService;

    public ModerationEventHandler(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @EventListener
    public void handleCarListingSubmitter(CarListingSubmittedEvent event){
        moderationService.submitForModeration(event.listingId());
    }
}
