package com.sweetspot.server.post;

import java.time.LocalDateTime;

public class MapPostResponseDto {
    private Long postId;
    private Long userId;
    private Long pinId;  // 추가된 필드
    private String title;
    private String content;
    private int likes;
    private LocalDateTime updatedAt;

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
