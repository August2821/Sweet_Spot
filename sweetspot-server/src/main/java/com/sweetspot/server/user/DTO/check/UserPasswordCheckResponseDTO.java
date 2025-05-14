package com.sweetspot.server.user.DTO.check;

public class UserPasswordCheckResponseDTO {
    private boolean match;
    private String message;

    public UserPasswordCheckResponseDTO(boolean match, String message) {
        this.match = match;
        this.message = message;
    }

    public boolean isMatch() { return match; }
    public String getMessage() { return message; }
}
