package com.sweetspot.server.post.image;

public class PostImageDetailDTO {
    private Long imageId;
    private String imageUrl;

    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
