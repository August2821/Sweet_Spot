package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;

public class UserCommentDTO {
    private Long commentId;
    private Long postId;
    private String content;
    private LocalDateTime updatedAt;
    private int likes;

    public UserCommentDTO(Long commentId, Long postId, String content, LocalDateTime updatedAt, int likes) {
        this.commentId = commentId;
        this.postId = postId;
        this.content = content;
        this.updatedAt = updatedAt;
        this.likes = likes;
    }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
}
