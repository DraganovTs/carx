package org.homecodecarx.user.service.constants;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Constants {

    REGISTRATION_SUCCESSFUL("Registration successful"),
    LOGIN_SUCCESSFUL("Login successful");

    private final String message;
}
