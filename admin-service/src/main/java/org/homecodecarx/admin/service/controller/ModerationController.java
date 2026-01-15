package org.homecodecarx.admin.service.controller;

import org.homecodecarx.admin.service.model.dto.ListingModerationDTO;
import org.homecodecarx.admin.service.model.entity.ListingModeration;
import org.homecodecarx.admin.service.service.ModerationService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/admin/moderations" , produces = MediaType.APPLICATION_JSON_VALUE)
public class ModerationController {

    private final ModerationService moderationService;

    public ModerationController(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ListingModerationDTO>> pending(){
        return ResponseEntity.ok(moderationService.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable UUID id,
            @RequestParam UUID adminId,
            @RequestParam(required = false) String comment
    ) {
        moderationService.approve(id, adminId, comment);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable UUID id,
            @RequestParam UUID adminId,
            @RequestParam String reason
    ) {
        moderationService.reject(id, adminId, reason);
        return ResponseEntity.ok().build();
    }


}
