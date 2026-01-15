package org.homecodecarx.admin.service.repository;

import org.homecodecarx.admin.service.model.entity.ListingModeration;
import org.homecodecarx.admin.service.model.enums.ModerationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingModerationRepository extends JpaRepository<ListingModeration, UUID> {

    List<ListingModeration> findByStatus(ModerationStatus status);
}
