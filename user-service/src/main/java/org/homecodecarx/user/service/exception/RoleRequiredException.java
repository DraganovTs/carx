package org.homecodecarx.user.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class RoleRequiredException extends BaseException {
    public RoleRequiredException(String message) {
        super(message, "ROLE_REQUIRED", HttpStatus.BAD_REQUEST);
    }
}
