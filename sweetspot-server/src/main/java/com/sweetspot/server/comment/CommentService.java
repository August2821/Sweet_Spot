package com.sweetspot.server.comment;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sweetspot.server.comment.DTO.CommentDeleteRequestDTO;
import com.sweetspot.server.comment.DTO.CommentRequestDTO;
import com.sweetspot.server.comment.DTO.CommentResponseDTO;
import com.sweetspot.server.comment.like.CommentLikeEntity;
import com.sweetspot.server.comment.like.CommentLikeRepository;
import com.sweetspot.server.post.MapPostRepository;
import com.sweetspot.server.user.UserRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MapPostRepository mapPostRepository;
    private final CommentLikeRepository commentLikeRepository;

    public CommentService(
        CommentRepository commentRepository,
        UserRepository userRepository,
        MapPostRepository mapPostRepository,
        CommentLikeRepository commentLikeRepository
    ) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.mapPostRepository = mapPostRepository;
        this.commentLikeRepository = commentLikeRepository;
    }

    public CommentResponseDTO createComment(CommentRequestDTO dto) {
        if (!userRepository.existsById(dto.getUserId())) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        if (!mapPostRepository.existsById(dto.getPostId())) {
            throw new IllegalArgumentException("존재하지 않는 게시글입니다.");
        }

        CommentEntity comment = new CommentEntity();
        comment.setUserId(dto.getUserId());
        comment.setPostId(dto.getPostId());
        comment.setContent(dto.getContent());

        CommentEntity saved = commentRepository.save(comment);
        return toDto(saved);
    }

    private CommentResponseDTO toDto(CommentEntity comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setUserId(comment.getUserId());
        dto.setPostId(comment.getPostId());
        dto.setContent(comment.getContent());
        dto.setLikes(comment.getLikes());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    //댓글 삭제
    public void deleteComment(CommentDeleteRequestDTO dto) {
        CommentEntity comment = commentRepository.findById(dto.getCommentId())
            .orElseThrow(() -> new IllegalArgumentException("댓글이 존재하지 않습니다."));

        if (!comment.getUserId().equals(dto.getUserId())) {
            throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }

    // 댓글 좋아요
    public boolean likeComment(Long userId, Long commentId) {
        // 이미 좋아요를 눌렀는지 확인
        if (commentLikeRepository.findByUserIdAndCommentId(userId, commentId).isPresent()) {
            return false;
        }

        CommentLikeEntity like = new CommentLikeEntity();
        like.setUserId(userId);
        like.setCommentId(commentId);
        commentLikeRepository.save(like);

        // 좋아요 수 증가
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikes(comment.getLikes() + 1);
            commentRepository.save(comment);
        });

        return true;
    }

    // 댓글 좋아요 취소
    @Transactional
    public boolean unlikeComment(Long userId, Long commentId) {
        Optional<CommentLikeEntity> likeOpt = commentLikeRepository.findByUserIdAndCommentId(userId, commentId);
        
        if (likeOpt.isEmpty()) {
            return false; // 좋아요 기록 없음
        }

        // 좋아요 기록 삭제
        commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);

        // 댓글 좋아요 수 감소
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikes(Math.max(0, comment.getLikes() - 1)); // 0 이하 방지
            commentRepository.save(comment);
        });

        return true;
    }
}
