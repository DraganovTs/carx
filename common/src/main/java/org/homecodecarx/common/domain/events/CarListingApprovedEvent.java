package org.homecodecarx.common.domain.events;

import org.homecodecarx.common.domain.DomainEvent;

import java.util.UUID;

public record CarListingApprovedEvent(
        UUID listingId,
        UUID adminId,
        String comment) implements DomainEvent {
}

