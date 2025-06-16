package com.sweetspot.server.pin.image;

public class PinImageDTO {
    private Long imageId;
    private Long pinId;
    private String imageUrl;
    private String fileName;


    // Getter / Setter
    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getfileName() { return fileName; }
    public void setfileName(String fileName) { this.fileName = fileName; }
}
