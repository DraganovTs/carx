package org.homecodecarx.car.listing.service.exception;

import org.homecodecarx.common.exception.BaseExceptionHandler;
import org.homecodecarx.common.exception.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class CarListingExceptionHandler extends BaseExceptionHandler {

    @ExceptionHandler(CarNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleCarNotFoundException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.NOT_FOUND, "CAR_NOT_FOUND");
    }
}
