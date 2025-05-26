package com.sweetspot.server.pin;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class PinService {
    private final PinRepository pinRepository;

    public PinService(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

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

    public boolean deletePin(Long pinId, Long userId) {
        Optional<PinEntity> pinOpt = pinRepository.findById(pinId);

        if (pinOpt.isPresent() && pinOpt.get().getUserId().equals(userId)) {
            pinRepository.deleteById(pinId);
            return true;
        }
        return false;
    }
}