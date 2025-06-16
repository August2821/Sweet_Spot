package com.sweetspot.server.post;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sweetspot.server.post.DTO.MapPostDeleteRequestDTO;
import com.sweetspot.server.post.DTO.MapPostListResponseDTO;
import com.sweetspot.server.post.DTO.MapPostPopularResponseDTO;
import com.sweetspot.server.post.DTO.MapPostRequestDTO;
import com.sweetspot.server.post.DTO.MapPostResponseDTO;
import com.sweetspot.server.post.DTO.MapPostDetailResponseDTO;
import com.sweetspot.server.post.DTO.MapPostDetailRequestDTO;
import com.sweetspot.server.post.like.PostLikeRequestDto;

@RestController
@RequestMapping("/api/posts")
public class MapPostController {
    private final MapPostService mapPostService;

    public MapPostController(MapPostService mapPostService) {
        this.mapPostService = mapPostService;
    }

    // 게시글 생성
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody MapPostRequestDTO requestDto) {
        try {
            MapPostResponseDTO responseDto = mapPostService.createPost(requestDto);
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 게시글 삭제
    @PostMapping("/delete")
    public ResponseEntity<?> deletePost(@RequestBody MapPostDeleteRequestDTO requestDto) {
        boolean deleted = mapPostService.deletePost(requestDto.getPostId(), requestDto.getUserId());

        if (deleted) {
            return ResponseEntity.ok().build(); // 삭제 성공 시 200 OK
        } else {
            return ResponseEntity.badRequest().build(); // 실패 시 400 Bad Request
        }
    }

    // 게시글 좋아요
    @PostMapping("/like")
    public ResponseEntity<?> likePost(@RequestBody PostLikeRequestDto requestDto) {
        boolean liked = mapPostService.likePost(requestDto.getUserId(), requestDto.getPostId());

        if (liked) {
            return ResponseEntity.ok().build(); // 성공
        } else {
            return ResponseEntity.badRequest().build(); // 중복 좋아요 방지
        }
    }

    // 게시글 좋아요 취소
    @PostMapping("/unlike")
    public ResponseEntity<?> unlikePost(@RequestBody PostLikeRequestDto requestDto) {
        boolean unliked = mapPostService.unlikePost(requestDto.getUserId(), requestDto.getPostId());

        if (unliked) {
            return ResponseEntity.ok().build(); // 성공
        } else {
            return ResponseEntity.badRequest().build(); // 실패 (기존 좋아요 없음)
        }
    }

    //인기 게시글 조회
    @GetMapping("/popular")
    public ResponseEntity<List<MapPostPopularResponseDTO>> getPopularPosts() {
        List<MapPostPopularResponseDTO> popularPosts = mapPostService.getPopularPostsOfDay();
        return ResponseEntity.ok(popularPosts);
    }

    // 전체 게시글 리스트 조회
    @GetMapping("/list")
    public ResponseEntity<List<MapPostListResponseDTO>> getAllPosts() {
        List<MapPostListResponseDTO> posts = mapPostService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    //게시글 조회
    @PostMapping("/detail")
    public ResponseEntity<?> getPostDetail(@RequestBody MapPostDetailRequestDTO requestDto) {
        try {
            MapPostDetailResponseDTO responseDto = mapPostService.getPostById(requestDto.getPostId());
            return ResponseEntity.ok(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
