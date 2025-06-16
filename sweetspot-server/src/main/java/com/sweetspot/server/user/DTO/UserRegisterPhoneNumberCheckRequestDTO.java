package com.sweetspot.server.user.DTO;

public class UserRegisterPhoneNumberCheckRequestDTO {
    private String phoneNumber;

    public UserRegisterPhoneNumberCheckRequestDTO() {}

    public UserRegisterPhoneNumberCheckRequestDTO(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
