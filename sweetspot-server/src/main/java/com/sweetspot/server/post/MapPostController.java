package com.sweetspot.server.post;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class MapPostController {
    private final MapPostService mapPostService;

    public MapPostController(MapPostService mapPostService) {
        this.mapPostService = mapPostService;
    }

    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody MapPostRequestDto requestDto) {
        try {
            MapPostResponseDto responseDto = mapPostService.createPost(requestDto);
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 게시글 삭제
    @PostMapping("/delete")
    public ResponseEntity<?> deletePost(@RequestBody MapPostDeleteRequestDto requestDto) {
        boolean deleted = mapPostService.deletePost(requestDto.getPostId(), requestDto.getUserId());

        if (deleted) {
            return ResponseEntity.ok().build(); // 삭제 성공 시 200 OK
        } else {
            return ResponseEntity.badRequest().build(); // 실패 시 400 Bad Request
        }
    }
}
