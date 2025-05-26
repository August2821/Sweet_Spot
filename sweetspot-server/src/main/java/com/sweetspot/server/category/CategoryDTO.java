package com.sweetspot.server.category;

public class CategoryDTO {
    private Long categoryId;
    private Long userId;
    private String name;

    // Getter & Setter
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
