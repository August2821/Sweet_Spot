package com.sweetspot.server.category.DTO;

//카테고리 조회 RequestDTO
public class CategoryUserRequestDTO {
    private Long userId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
