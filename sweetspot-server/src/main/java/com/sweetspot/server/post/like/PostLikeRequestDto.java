package com.sweetspot.server.post.like;

public class PostLikeRequestDto {
    private Long userId;
    private Long postId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
}