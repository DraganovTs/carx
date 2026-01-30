package org.homecodecarx.user.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class InvalidRoleException extends BaseException {
    public InvalidRoleException(String message) {
        super(message, "INVALID_ROLE", HttpStatus.BAD_REQUEST);
    }
}
