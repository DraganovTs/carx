package org.homecodecarx.common.domain;

public interface DomainEventPublisher {
    void publish(DomainEvent event);
}
