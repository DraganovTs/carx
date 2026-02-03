package org.homecodecarx.common.domain.events;

import org.homecodecarx.common.domain.DomainEvent;

import java.util.UUID;

public record CarListingRejectedEvent(

        UUID listingId,
        UUID adminId,
        String reason) implements DomainEvent {
}
