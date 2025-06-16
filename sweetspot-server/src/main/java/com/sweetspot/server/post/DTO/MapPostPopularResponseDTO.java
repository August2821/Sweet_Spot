package com.sweetspot.server.post.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.sweetspot.server.pin.DTO.PinInfoDTO;


public class MapPostPopularResponseDTO {
    private Long postId;
    private String title;
    private LocalDateTime updatedAt;
    private int likes;
    private Long userId;
    private String nickname;
    private List<PinInfoDTO> pins;

    // Getters & Setters
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public List<PinInfoDTO> getPins() { return pins; }
    public void setPins(List<PinInfoDTO> pins) { this.pins = pins; }
}