package com.sweetspot.server.pin.image;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PinImageRepository extends JpaRepository<PinImageEntity, Long> {
    Optional<PinImageEntity> findFirstByPinIdOrderByUploadedAtAsc(Long pinId);
}