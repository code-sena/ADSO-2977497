package com.sena.store.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.store.Entity.Product;
import com.sena.store.IRepository.IProductRepository;
import com.sena.store.IService.IProductService;

@Service
public class ProductService implements IProductService {
    
    @Autowired
    private IProductRepository productRepository;

    @Override
    public List<Product> findAll() {        
        return productRepository.findAll();
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }    
}
