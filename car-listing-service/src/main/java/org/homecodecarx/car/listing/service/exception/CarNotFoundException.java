package org.homecodecarx.car.listing.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class CarNotFoundException extends BaseException {
    public CarNotFoundException( String message) {
        super( message, "CAR_NOT_FOUND_EXCEPTION",  HttpStatus.NOT_FOUND);
    }
}
