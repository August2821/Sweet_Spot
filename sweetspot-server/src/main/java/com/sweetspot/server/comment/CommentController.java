package com.sweetspot.server.comment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sweetspot.server.comment.DTO.CommentDeleteRequestDTO;
import com.sweetspot.server.comment.DTO.CommentRequestDTO;
import com.sweetspot.server.comment.DTO.CommentResponseDTO;
import com.sweetspot.server.comment.like.CommentLikeRequestDto;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    //댓글 생성
    @PostMapping("/create")
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentRequestDTO dto) {
        try {
            CommentResponseDTO response = commentService.createComment(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 메시지 없이 400 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 기타 예외는 500
        }
    }

    //댓글 삭제
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteComment(@RequestBody CommentDeleteRequestDTO dto) {
        try {
            commentService.deleteComment(dto);
            return ResponseEntity.ok().build(); // 삭제 성공
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // 메시지 없이 400 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 기타 예외는 500
        }
    }

    // 댓글 좋아요
    @PostMapping("/like")
    public ResponseEntity<?> likeComment(@RequestBody CommentLikeRequestDto requestDto) {
        boolean liked = commentService.likeComment(requestDto.getUserId(), requestDto.getCommentId());

        if (liked) {
            return ResponseEntity.ok().build(); // 성공
        } else {
            return ResponseEntity.badRequest().build(); // 중복 좋아요 방지
        }
    }

    // 댓글 좋아요 취소
    @PostMapping("/unlike")
    public ResponseEntity<?> unlikeComment(@RequestBody CommentLikeRequestDto requestDto) {
        boolean unliked = commentService.unlikeComment(requestDto.getUserId(), requestDto.getCommentId());

        if (unliked) {
            return ResponseEntity.ok().build(); // 성공
        } else {
            return ResponseEntity.badRequest().build(); // 실패 (좋아요 기록 없음)
        }
    }
}
