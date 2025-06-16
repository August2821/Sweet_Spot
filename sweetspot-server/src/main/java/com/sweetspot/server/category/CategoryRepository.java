package com.sweetspot.server.category;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    List<CategoryEntity> findByUserId(Long userId);
    Optional<CategoryEntity> findByCategoryIdAndUserId(Long categoryId, Long userId);
}