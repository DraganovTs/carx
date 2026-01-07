package org.homecodecarx.user.service.exception;

import org.homecodecarx.common.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserAlreadyExistException extends BaseException {

    public UserAlreadyExistException( String message) {
        super(message, "USER_ALREADY_EXIST", HttpStatus.CONFLICT);
    }
}
