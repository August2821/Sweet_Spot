package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class UserInfoResponseDTO {
    private String email;
    private String phoneNumber;
    private String nickname;
    private boolean phoneVerified;
    private String profileImageUrl;
    private LocalDateTime createdAt;
    private List<UserPostSummaryDTO> posts;
    private List<UserCommentDTO> comments;
    private List<UserLikedPostDTO> likedPosts;
    private List<UserLikedCommentDTO> likedComments;

    public UserInfoResponseDTO(String email, String phoneNumber, String nickname,
            boolean phoneVerified, String profileImageUrl, LocalDateTime createdAt,
            List<UserPostSummaryDTO> posts, List<UserCommentDTO> comments,
            List<UserLikedPostDTO> likedPosts, List<UserLikedCommentDTO> likedComments) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nickname = nickname;
        this.phoneVerified = phoneVerified;
        this.profileImageUrl = profileImageUrl;
        this.createdAt = createdAt;
        this.posts = posts;
        this.comments = comments;
        this.likedPosts = likedPosts;
        this.likedComments = likedComments;
    }

    // Getters
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getNickname() { return nickname; }
    public boolean isPhoneVerified() { return phoneVerified; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<UserPostSummaryDTO> getPosts() { return posts; }
    public List<UserCommentDTO> getComments() { return comments; }
    public List<UserLikedPostDTO> getLikedPosts() { return likedPosts; }
    public List<UserLikedCommentDTO> getLikedComments() { return likedComments; }
}