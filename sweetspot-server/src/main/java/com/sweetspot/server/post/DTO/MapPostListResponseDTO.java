package com.sweetspot.server.post.DTO;

import java.time.LocalDateTime;

public class MapPostListResponseDTO {
    private Long postId;
    private String title;
    private LocalDateTime updatedAt;
    private int likes;
    private Long userId;
    private String nickname;

    public MapPostListResponseDTO(Long postId, String title, LocalDateTime updatedAt, int likes, Long userId, String nickname) {
        this.postId = postId;
        this.title = title;
        this.updatedAt = updatedAt;
        this.likes = likes;
        this.userId = userId;
        this.nickname = nickname;
    }

    // Getters
    public Long getPostId() { return postId; }
    public String getTitle() { return title; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public int getLikes() { return likes; }
    public Long getUserId() { return userId; }
    public String getNickname() { return nickname; }
}