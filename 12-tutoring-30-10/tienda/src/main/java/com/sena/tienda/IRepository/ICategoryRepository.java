package com.sena.tienda.IRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.tienda.Entity.Category;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    
}
