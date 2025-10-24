package com.sena.store.IService;

import java.util.List;

import com.sena.store.Entity.Category;

public interface ICategoryService {
    List<Category> findAll();
    Category findById(Long id);
    Category save(Category category);
    void deleteById(Long id);
}
