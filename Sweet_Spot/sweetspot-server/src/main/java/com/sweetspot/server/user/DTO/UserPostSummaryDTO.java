package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;

public class UserPostSummaryDTO {
    private Long postId;
    private String title;
    private LocalDateTime updatedAt;
    private int likes;

    public UserPostSummaryDTO(Long postId, String title, LocalDateTime updatedAt, int likes) {
        this.postId = postId;
        this.title = title;
        this.updatedAt = updatedAt;
        this.likes = likes;
    }

    // Getters
    public Long getPostId() { return postId; }
    public String getTitle() { return title; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public int getLikes() { return likes; }
}
