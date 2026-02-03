package org.homecodecarx.admin.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class ListingModerationNotFoundException extends BaseException {

    public ListingModerationNotFoundException(String message) {
        super(message, "LISTING_MODERATION_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
