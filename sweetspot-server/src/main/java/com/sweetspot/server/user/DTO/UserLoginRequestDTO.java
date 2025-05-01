package com.sweetspot.server.user.DTO;

public class UserLoginRequestDTO {
    private String email; // 이메일
    private String password; // 비밀번호

    public String getEmail() { return email; } 
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; } 
    public void setPassword(String password) { this.password = password; }
}
