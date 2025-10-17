package com.sena.store.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.store.Entity.Category;
import com.sena.store.IService.ICategoryService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/category")
public class CategoryController {
    
    @Autowired
    private ICategoryService categoryService;

    @PostMapping
    public Category save(@RequestBody Category entity) {
        return categoryService.save(entity);
    }

    @GetMapping()
    public List<Category> findAll() {
        return categoryService.findAll();
    }
    
    
}
