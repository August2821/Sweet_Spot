package com.sweetspot.server.user.DTO.update;

public class UserPasswordUpdateResponseDTO {
    private boolean success;
    private String message;

    public UserPasswordUpdateResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getter/Setter
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
}
