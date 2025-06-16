package com.sweetspot.server.post.image;

public class PostImageDTO {
    private Long imageId;
    private Long postId;
    private String imageUrl;
    private String fileName;

    // Getter / Setter
    public Long getImageId() { return imageId; }
    public void setImageId(Long imageId) { this.imageId = imageId; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getfileName() { return fileName; }
    public void setfileName(String fileName) { this.fileName = fileName; }
}
