package com.sena.store.IRepository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.store.Entity.Product;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {
    
}
