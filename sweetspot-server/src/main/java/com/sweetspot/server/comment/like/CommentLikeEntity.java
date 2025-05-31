package com.sweetspot.server.comment.like;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "comment_likes")
public class CommentLikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long likeId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "comment_id", nullable = false)
    private Long commentId;

    // Getter & Setter
    public Long getLikeId() { return likeId; }
    public void setLikeId(Long likeId) { this.likeId = likeId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }
}