package com.sweetspot.server.pin;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sweetspot.server.pin.DTO.PinDTO;
import com.sweetspot.server.pin.DTO.PinResponseDTO;
import com.sweetspot.server.pin.image.PinImageEntity;
import com.sweetspot.server.pin.image.PinImageInfoDTO;
import com.sweetspot.server.pin.image.PinImageService;

@Service
public class PinService {
    private final PinRepository pinRepository;
    private final PinImageService pinImageService;

    public PinService(PinRepository pinRepository, PinImageService pinImageService) {
        this.pinRepository = pinRepository;
        this.pinImageService = pinImageService;
    }

    //핀 생성
    public PinDTO savePin(PinDTO dto) {
        PinEntity pin = new PinEntity();
        pin.setUserId(dto.getUserId());
        pin.setCategoryId(dto.getCategoryId());
        pin.setLatitude(dto.getLatitude());
        pin.setLongitude(dto.getLongitude());
        pin.setTitle(dto.getTitle());
        pin.setDescription(dto.getDescription());

        PinEntity saved = pinRepository.save(pin);

        dto.setPinId(saved.getPinId());
        return dto;
    }

    //핀 삭제
    public boolean deletePin(Long pinId, Long userId) {
        Optional<PinEntity> pinOpt = pinRepository.findById(pinId);

        if (pinOpt.isPresent() && pinOpt.get().getUserId().equals(userId)) {
            pinRepository.deleteById(pinId);
            return true;
        }
        return false;
    }

    //핀 리스트 조회
    public List<PinResponseDTO> getPinsByCategoryId(Long categoryId) {
        List<PinEntity> pins = pinRepository.findByCategoryId(categoryId);
        return pins.stream().map(pin -> {
            PinResponseDTO dto = new PinResponseDTO();
            dto.setPinId(pin.getPinId());
            dto.setTitle(pin.getTitle());
            dto.setDescription(pin.getDescription());
            dto.setLatitude(pin.getLatitude());
            dto.setLongitude(pin.getLongitude());
            dto.setCreatedAt(pin.getCreatedAt());

            // 이미지 정보 추가
            Optional<PinImageEntity> imageOpt = pinImageService.findFirstImageByPinId(pin.getPinId());
            imageOpt.ifPresent(image -> {
                PinImageInfoDTO imageDTO = new PinImageInfoDTO(image.getImageId(), image.getImageUrl());
                dto.setImageInfo(imageDTO);
            });

            return dto;
        }).collect(Collectors.toList());
    }
}