package com.sena.store.IRepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.store.Entity.Category;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, Long> {
    
}
