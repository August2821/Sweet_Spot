package com.sweetspot.server.post.DTO;

public class MapPostDeleteRequestDTO {
    private Long postId;
    private Long userId;

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
