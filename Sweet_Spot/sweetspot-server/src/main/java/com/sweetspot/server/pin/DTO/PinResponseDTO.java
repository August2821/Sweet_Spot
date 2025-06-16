// PinResponseDTO.java
package com.sweetspot.server.pin.DTO;

import java.time.LocalDateTime;

import com.sweetspot.server.pin.image.PinImageInfoDTO;

//핀 리스트 조회 ResponseDTO
public class PinResponseDTO {
    private Long pinId;
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private PinImageInfoDTO imageInfo;

    // Getter & Setter
    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public PinImageInfoDTO getImageInfo() { return imageInfo; }
    public void setImageInfo(PinImageInfoDTO imageInfo) { this.imageInfo = imageInfo; }
}