package com.sweetspot.server.user.DTO.check;

public class UserRegisterEmailCheckRequestDTO {
    private String email;

    public UserRegisterEmailCheckRequestDTO() {}

    public UserRegisterEmailCheckRequestDTO(String email) {
        this.email = email;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
