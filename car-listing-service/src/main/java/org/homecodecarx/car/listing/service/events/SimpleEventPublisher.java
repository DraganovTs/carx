package org.homecodecarx.car.listing.service.events;

import org.homecodecarx.common.domain.DomainEvent;
import org.homecodecarx.common.domain.DomainEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class SimpleEventPublisher implements DomainEventPublisher {
    @Override
    public void publish(DomainEvent event) {
        System.out.println("Event published: " + event );
    }
}
