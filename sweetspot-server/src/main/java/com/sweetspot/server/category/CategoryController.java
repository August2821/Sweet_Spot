package com.sweetspot.server.category;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sweetspot.server.category.DTO.CategoryDTO;
import com.sweetspot.server.category.DTO.CategoryDeleteDTO;
import com.sweetspot.server.category.DTO.CategoryDeleteErrorResponseDTO;
import com.sweetspot.server.category.DTO.CategoryDeleteMessageResponseDTO;
import com.sweetspot.server.category.DTO.CategoryResponseDTO;
import com.sweetspot.server.category.DTO.CategoryUserRequestDTO;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // POST /api/categories : 카테고리 생성
    @PostMapping("/create")
    public CategoryDTO createCategory(@RequestBody CategoryDTO dto) {
        return categoryService.createCategory(dto);
    }

    // POST /api/categories/delete : 카테고리 삭제
    @PostMapping("/delete")
    public ResponseEntity<?> deleteCategory(@RequestBody CategoryDeleteDTO request) {
        boolean deleted = categoryService.deleteCategory(request.getCategoryId(), request.getUserId());

        if (deleted) {
            return ResponseEntity.ok(new CategoryDeleteMessageResponseDTO("Category deleted successfully."));
        } else {
            return ResponseEntity.badRequest().body(new CategoryDeleteErrorResponseDTO("Category not found."));
        }
    }

    @PostMapping("/list")
    public ResponseEntity<List<CategoryResponseDTO>> getCategoriesByUser(@RequestBody CategoryUserRequestDTO request) {
        List<CategoryResponseDTO> categories = categoryService.getCategoriesByUserId(request.getUserId());
        return ResponseEntity.ok(categories);
    }
}
