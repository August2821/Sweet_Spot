package com.sweetspot.server.category.DTO;

public class CategoryDeleteErrorResponseDTO {
    private String error;

    public CategoryDeleteErrorResponseDTO(String error) {
        this.error = error;
    }

    public String getError() { return error; }
}
