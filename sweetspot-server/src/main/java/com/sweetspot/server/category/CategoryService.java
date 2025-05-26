package com.sweetspot.server.category;

import org.springframework.stereotype.Service;

@Service
public class CategoryService {
    private CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // 카테고리 생성
    public CategoryDTO createCategory(CategoryDTO dto) {
        CategoryEntity category = new CategoryEntity();
        category.setUserId(dto.getUserId());
        category.setName(dto.getName());

        CategoryEntity saved = categoryRepository.save(category);

        dto.setCategoryId(saved.getCategoryId());
        return dto;
    }

    //카테고리 삭제
    public boolean deleteCategory(Long categoryId, Long userId) {
        // 사용자 본인의 카테고리만 삭제 가능하도록 조건 확인
        return categoryRepository.findById(categoryId)
            .filter(category -> category.getUserId().equals(userId))
            .map(category -> {
                categoryRepository.delete(category);
                return true;
            })
            .orElse(false);
    }
}