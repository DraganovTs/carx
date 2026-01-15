package org.homecodecarx.common.domain.events;

import org.homecodecarx.common.domain.DomainEvent;

import java.util.UUID;

public record CarListingSubmittedEvent(
        UUID listingId
) implements DomainEvent {
}


