package com.sweetspot.server.comment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
