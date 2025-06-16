package com.sweetspot.server.post;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MapPostRepository extends JpaRepository<MapPostEntity, Long> {
    @Query("SELECT p FROM MapPostEntity p " +
           "WHERE p.updatedAt >= :startOfDay AND p.updatedAt < :endOfDay " +
           "ORDER BY p.likes DESC")
    List<MapPostEntity> findTop10PopularPostsOfDay(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<MapPostEntity> findAllByOrderByUpdatedAtDesc();
    List<MapPostEntity> findByUserId(Long userId);
}