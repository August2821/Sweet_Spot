package com.sweetspot.server.post.image;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImageEntity, Long> {
    List<PostImageEntity> findByPostId(Long postId);
}
