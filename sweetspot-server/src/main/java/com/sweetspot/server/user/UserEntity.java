package com.sweetspot.server.user;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // 사용자 고유 ID
    
    @Column(nullable = false, unique = true)
    private String email; // 이메일

    @Column(nullable = false)
    private String password; // 비밀번호

    private String nickname; // 닉네임

    @Column(unique = true)
    private String phoneNumber; // 전화번호

    @Column(nullable = false)
    private boolean isPhoneVerified = false; // 전화번호 인증 여부

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    private String profile_image_name;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now(); // 가입일

    @PrePersist // 엔티티가 저장되기 전에 자동으로 호출되는 메서드
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

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
    
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getProfileImageName() { return profile_image_name; }
    public void setProfileImageName(String profile_image_name) { this.profile_image_name = profile_image_name; }

    public LocalDateTime getCreatedAt() { return createdAt; } 
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
