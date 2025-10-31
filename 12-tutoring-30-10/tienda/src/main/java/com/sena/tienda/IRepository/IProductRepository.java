package com.sena.tienda.IRepository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.tienda.Entity.Product;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {
    
}
