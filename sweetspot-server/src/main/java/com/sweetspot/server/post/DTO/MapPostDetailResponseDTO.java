package com.sweetspot.server.post.DTO;

import java.time.LocalDateTime;
import java.util.List;

import com.sweetspot.server.comment.DTO.CommentDetailDTO;
import com.sweetspot.server.post.image.PostImageDetailDTO;

public class MapPostDetailResponseDTO {
    private Long postId;
    private Long userId;
    private String nickname;
    private String title;
    private String content;
    private LocalDateTime updatedAt;
    private int likes;
    private List<CommentDetailDTO> comments;
    private List<PostImageDetailDTO> images;

    // Getters & Setters
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public List<CommentDetailDTO> getComments() { return comments; }
    public void setComments(List<CommentDetailDTO> comments) { this.comments = comments; }

    public List<PostImageDetailDTO> getImages() { return images; }
    public void setImages(List<PostImageDetailDTO> images) { this.images = images; }
}
