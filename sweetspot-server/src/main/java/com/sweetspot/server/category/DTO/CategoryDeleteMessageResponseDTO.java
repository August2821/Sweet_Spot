package com.sweetspot.server.category.DTO;

public class CategoryDeleteMessageResponseDTO {
    private String message;

    public CategoryDeleteMessageResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
}
