package com.sweetspot.server.user.DTO.update;

public class UserPasswordUpdateRequestDTO {
    private Long userId;
    private String newPassword;

    // Getter/Setter
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
