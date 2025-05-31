package com.sweetspot.server.post.image;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sweetspot.server.post.MapPostEntity;
import com.sweetspot.server.post.MapPostRepository;

@Service
public class PostImageService {
    private final MapPostRepository postRepository;
    private final PostImageRepository postImageRepository;

    public PostImageService(MapPostRepository postRepository, PostImageRepository postImageRepository) {
        this.postRepository = postRepository;
        this.postImageRepository = postImageRepository;
    }

    public PostImageDTO saveImage(PostImageDTO dto) {
        Optional<MapPostEntity> pinOpt = postRepository.findById(dto.getPostId());
        if (pinOpt.isEmpty()) {
            throw new IllegalArgumentException("해당 게시글이 존재하지 않습니다.");
        }

        PostImageEntity image = new PostImageEntity();
        image.setPostId(dto.getPostId());
        image.setImageUrl(dto.getImageUrl());
        image.setfileName(dto.getfileName()); // 여기에 fileName 설정

        PostImageEntity saved = postImageRepository.save(image);
        dto.setImageId(saved.getImageId());
        return dto;
    }
}