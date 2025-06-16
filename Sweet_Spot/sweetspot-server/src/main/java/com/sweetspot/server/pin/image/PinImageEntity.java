package com.sweetspot.server.pin.image;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "pin_images")
public class PinImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    private Long pinId;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private String fileName;

    // @Column(nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @PrePersist // 엔티티가 저장되기 전에 자동으로 호출되는 메서드
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Getter / Setter
    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getfileName() { return fileName; }
    public void setfileName(String fileName) { this.fileName = fileName; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}