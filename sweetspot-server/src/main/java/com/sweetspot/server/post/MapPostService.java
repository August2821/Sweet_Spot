package com.sweetspot.server.post;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sweetspot.server.pin.PinRepository;
import com.sweetspot.server.user.UserRepository;

@Service
public class MapPostService {
    private final MapPostRepository mapPostRepository;
    private final UserRepository userRepository;
    private final PinRepository pinRepository;


    public MapPostService(
        MapPostRepository mapPostRepository,
        UserRepository userRepository,
        PinRepository pinRepository
    ) {
        this.mapPostRepository = mapPostRepository;
        this.userRepository = userRepository;
        this.pinRepository = pinRepository;
    }

    // 게시글 저장
    public MapPostResponseDto createPost(MapPostRequestDto dto) {
        // 유저 존재 여부 확인
        if (!userRepository.existsById(dto.getUserId())) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        // 핀 존재 여부 확인
        if (!pinRepository.existsById(dto.getPinId())) {
            throw new IllegalArgumentException("존재하지 않는 핀입니다.");
        }

        MapPostEntity post = new MapPostEntity();
        post.setUserId(dto.getUserId());
        post.setPinId(dto.getPinId());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());

        MapPostEntity saved = mapPostRepository.save(post);

        return toDto(saved);
    }

    // 게시글 삭제
    public boolean deletePost(Long postId, Long userId) {
        Optional<MapPostEntity> postOpt = mapPostRepository.findById(postId);

        if (postOpt.isPresent() && postOpt.get().getUserId().equals(userId)) {
            mapPostRepository.deleteById(postId);
            return true;
        }
        return false;
    }

    // Entity → Response DTO 변환
    private MapPostResponseDto toDto(MapPostEntity post) {
        MapPostResponseDto dto = new MapPostResponseDto();
        dto.setPostId(post.getPostId());
        dto.setUserId(post.getUserId());
        dto.setPinId(post.getPinId()); // 추가된 필드 반영
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setLikes(post.getLikes());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}
