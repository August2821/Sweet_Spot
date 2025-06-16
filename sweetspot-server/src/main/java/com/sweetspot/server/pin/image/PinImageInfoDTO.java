package com.sweetspot.server.pin.image;

//핀 리스트 조회
public class PinImageInfoDTO {
    private Long imageId;
    private String imageUrl;

    public PinImageInfoDTO() {}

    public PinImageInfoDTO(Long imageId, String imageUrl) {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
    }

    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
