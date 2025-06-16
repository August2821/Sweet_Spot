package com.sweetspot.server.post.like;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLikeEntity, Long> {
    Optional<PostLikeEntity> findByUserIdAndPostId(Long userId, Long postId);
    Long countByPostId(Long postId);
    void deleteByUserIdAndPostId(Long userId, Long postId); // 삭제용 메서드
    List<PostLikeEntity> findByUserId(Long userId);
}