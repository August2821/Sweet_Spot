package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;

public class UserRegisterDTO {
    private Long userId; // 사용자 고유 ID
    private String email; // 이메일
    private String password; // 비밀번호
    private String nickname; // 닉네임
    private String phoneNumber; // 전화번호
    private boolean isPhoneVerified; // 전화번호 인증 여부
    private LocalDateTime createdAt; // 가입일
    private String profileImageUrl; //프로필 이미지
    private String profileImageName; //이미지 파일 이름

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getEmail() { return email; } 
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; } 
    public void setPassword(String password) { this.password = password; }
    
    public String getNickname() { return nickname; } 
    public void setNickname(String nickname) { this.nickname = nickname; }
    
    public String getPhoneNumber() { return phoneNumber; } 
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public boolean isPhoneVerified() { return isPhoneVerified; } 
    public void setPhoneVerified(boolean isPhoneVerified) { this.isPhoneVerified = isPhoneVerified; }
    
    public LocalDateTime getCreatedAt() { return createdAt; } 
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getProfileImageName() { return profileImageName; }
    public void setProfileImageName(String profileImageName) { this.profileImageName = profileImageName; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}
