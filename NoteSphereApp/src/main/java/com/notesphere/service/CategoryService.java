package com.notesphere.service;

import com.notesphere.model.Category;
import com.notesphere.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createOrGetCategory(String name) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(new Category(name)));
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public boolean categoryExists(String name) {
        return categoryRepository.existsByName(name);
    }
}