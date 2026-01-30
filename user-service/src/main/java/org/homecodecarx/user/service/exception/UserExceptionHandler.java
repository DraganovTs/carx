package org.homecodecarx.user.service.exception;

import org.homecodecarx.common.exception.BaseExceptionHandler;
import org.homecodecarx.common.exception.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class UserExceptionHandler extends BaseExceptionHandler {

    @ExceptionHandler(value = {UserAlreadyExistException.class})
    public ResponseEntity<ErrorResponseDTO> handleUserAlreadyExistException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.CONFLICT, "USER_ALREADY_EXIST");
    }

    @ExceptionHandler(value = {UserNotFoundException.class})
    public ResponseEntity<ErrorResponseDTO> handleUserNotFoundException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.NOT_FOUND, "USER_NOT_FOUND");
    }

    @ExceptionHandler(value = {PasswordNotMatchException.class})
    public ResponseEntity<ErrorResponseDTO> handlePasswordNotMatchException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.BAD_REQUEST, "PASSWORD_OR_EMAIL_NOT_MATCH");
    }

    @ExceptionHandler(value = {InvalidRoleException.class})
    public ResponseEntity<ErrorResponseDTO> handleInvalidRoleException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.BAD_REQUEST, "INVALID_ROLE");
    }

    @ExceptionHandler(value = {RoleRequiredException.class})
    public ResponseEntity<ErrorResponseDTO> handleRoleRequiredException(Exception exception, WebRequest request) {
        return buildErrorResponse(exception, request, HttpStatus.FORBIDDEN, "ROLE_REQUIRED");
    }
}
