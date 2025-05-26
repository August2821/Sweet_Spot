package com.sweetspot.server.comment;

import org.springframework.stereotype.Service;

import com.sweetspot.server.post.MapPostRepository;
import com.sweetspot.server.user.UserRepository;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MapPostRepository mapPostRepository;

    public CommentService(
        CommentRepository commentRepository,
        UserRepository userRepository,
        MapPostRepository mapPostRepository
    ) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.mapPostRepository = mapPostRepository;
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
}
