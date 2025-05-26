package com.sweetspot.server.category;

public class CategoryDeleteDTO {
    private Long categoryId;
    private Long userId;

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
