package com.sena.tienda.IService;

import java.util.List;

import com.sena.tienda.Entity.Category;

public interface ICategoryService {
    List<Category> findAll();
    Category findById(Long id);
    Category save(Category category);
    void deleteById(Long id);
}
