package org.homecodecarx.admin.service.event.publisher;

import org.homecodecarx.common.domain.DomainEvent;
import org.homecodecarx.common.domain.DomainEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class CarListingEventPublisher implements DomainEventPublisher {
    @Override
    public void publish(DomainEvent event) {

    }
}
