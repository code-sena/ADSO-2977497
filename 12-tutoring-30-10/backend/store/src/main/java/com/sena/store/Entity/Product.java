package com.sena.store.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "description", length = 100)
    private String description;

    @Column(name = "unit_value", nullable = false)
    private Double unitValue;

    @Column(name = "stock", nullable = false)
    private Integer stock;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    public Long getId() {
        return id;
    } 
    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }
    public Double getUnitValue() {
        return unitValue;
    }
    public Integer getStock() {
        return stock;
    }
    public Category getCategory() {
        return category;
    }
    public Boolean getStatus() {
        return status;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setUnitValue(Double unitValue) {
        this.unitValue = unitValue;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    public void setCategory(Category category) {
        this.category = category;
    }   
    public void setStatus(Boolean status) {
        this.status = status;
    }
}
