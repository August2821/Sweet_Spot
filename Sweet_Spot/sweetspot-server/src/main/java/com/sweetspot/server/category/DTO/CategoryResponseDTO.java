package com.sweetspot.server.category.DTO;

import java.time.LocalDateTime;

//카테고리 조회 ResponseDTO
public class CategoryResponseDTO {
    private Long categoryId;
    private String name;
    private LocalDateTime createdAt;

    public CategoryResponseDTO(Long categoryId, String name, LocalDateTime createdAt) {
        this.categoryId = categoryId;
        this.name = name;
        this.createdAt = createdAt;
    }

    public Long getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
