package com.sweetspot.server.pin;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PinRepository extends JpaRepository<PinEntity, Long> {
    //해당 카테고리 핀 조회
    List<PinEntity> findByCategoryId(Long categoryId);
}