package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;

public class UserLikedCommentDTO {
    private Long commentId;
    private Long postId;
    private String content;
    private LocalDateTime updatedAt;
    private int likes;
    private Long authorId;
    private String authorNickname;

    public UserLikedCommentDTO(Long commentId, Long postId, String content, LocalDateTime updatedAt, int likes,
                                Long authorId, String authorNickname) {
        this.commentId = commentId;
        this.postId = postId;
        this.content = content;
        this.updatedAt = updatedAt;
        this.likes = likes;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
    }

    // Getters
    public Long getCommentId() { return commentId; }
    public Long getPostId() { return postId; }
    public String getContent() { return content; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public int getLikes() { return likes; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorNickname() { return authorNickname; }
}
