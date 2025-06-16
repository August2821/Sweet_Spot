package com.sweetspot.server.user.DTO.check;

public class UserPasswordCheckRequestDTO {
    private Long userId;
    private String password;

    // Getter, Setter
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
