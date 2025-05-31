package com.sweetspot.server.pin.image;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sweetspot.server.pin.PinRepository;
import com.sweetspot.server.pin.PinEntity;

@Service
public class PinImageService {
    private final PinRepository pinRepository;
    private final PinImageRepository pinImageRepository;

    public PinImageService(PinRepository pinRepository, PinImageRepository pinImageRepository) {
        this.pinRepository = pinRepository;
        this.pinImageRepository = pinImageRepository;
    }

    public PinImageDTO saveImage(PinImageDTO dto) {
        Optional<PinEntity> pinOpt = pinRepository.findById(dto.getPinId());
        if (pinOpt.isEmpty()) {
            throw new IllegalArgumentException("해당 핀이 존재하지 않습니다.");
        }

        PinImageEntity image = new PinImageEntity();
        image.setPinId(dto.getPinId());
        image.setImageUrl(dto.getImageUrl());
        image.setfileName(dto.getfileName()); // 여기에 fileName 설정

        PinImageEntity saved = pinImageRepository.save(image);
        dto.setImageId(saved.getImageId());
        return dto;
    }

    public Optional<PinImageEntity> findFirstImageByPinId(Long pinId) {
        return pinImageRepository.findFirstByPinIdOrderByUploadedAtAsc(pinId);
    }
}