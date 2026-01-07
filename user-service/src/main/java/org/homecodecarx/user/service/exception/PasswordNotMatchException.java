package org.homecodecarx.user.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class PasswordNotMatchException extends BaseException {
    public PasswordNotMatchException(String message) {
        super(message, "PASSWORD_OR_EMAIL_NOT_MATCH", HttpStatus.BAD_REQUEST);
    }
}
