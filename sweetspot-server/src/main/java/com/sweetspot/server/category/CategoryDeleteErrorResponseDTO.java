package com.sweetspot.server.category;

public class CategoryDeleteErrorResponseDTO {
    private String error;

    public CategoryDeleteErrorResponseDTO(String error) {
        this.error = error;
    }

    public String getError() { return error; }
}
