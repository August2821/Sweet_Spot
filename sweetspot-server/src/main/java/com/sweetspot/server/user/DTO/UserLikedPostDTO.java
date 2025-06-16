package com.sweetspot.server.user.DTO;

import java.time.LocalDateTime;

public class UserLikedPostDTO {
    private Long postId;
    private String title;
    private LocalDateTime updatedAt;
    private int likes;
    private Long authorId;
    private String authorNickname;

    public UserLikedPostDTO(Long postId, String title, LocalDateTime updatedAt, int likes, Long authorId, String authorNickname) {
        this.postId = postId;
        this.title = title;
        this.updatedAt = updatedAt;
        this.likes = likes;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
    }

    public Long getPostId() { return postId; }
    public String getTitle() { return title; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public int getLikes() { return likes; }
    public Long getAuthorId() { return authorId; }
    public String getAuthorNickname() { return authorNickname; }
}
