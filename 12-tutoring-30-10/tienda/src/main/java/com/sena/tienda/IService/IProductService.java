package com.sena.tienda.IService;

import java.util.List;

import com.sena.tienda.Entity.Product;

public interface IProductService {
    List<Product> findAll();
    Product findById(Long id);
    Product save(Product product);
    void deleteById(Long id);
}
