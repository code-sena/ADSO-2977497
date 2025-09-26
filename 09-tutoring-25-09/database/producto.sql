DROP DATABASE IF EXISTS store_management;
CREATE DATABASE store_management;
USE store_management;
-- DDL Script for Category and Product Tables
-- Database: Store Management System

-- Create Category Table
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status BOOLEAN NOT NULL DEFAULT TRUE    
);

-- Create Product Table
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    unit_value DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES category(id) 
);

-- INSERT TEST DATA
-- Insert 5 market categories (respecting PK auto-increment)
INSERT INTO category (name, description, status) VALUES
('Fruits and Vegetables', 'Fresh fruits and vegetables section', TRUE),
('Dairy and Eggs', 'Dairy products, milk, cheese, and eggs', TRUE),
('Meat and Seafood', 'Fresh meat, poultry, and seafood products', TRUE),
('Bakery', 'Bread, pastries, and baked goods', TRUE),
('Beverages', 'Drinks, juices, sodas, and water', TRUE);

-- Insert 30 market products (6 products per category, respecting FK integrity)
INSERT INTO product (name, description, unit_value, stock, category_id, status) VALUES
-- Fruits and Vegetables (category_id = 1)
('Bananas', 'Fresh yellow bananas per pound', 1.29, 150, 1, TRUE),
('Red Apples', 'Crispy red apples per pound', 2.49, 120, 1, TRUE),
('Carrots', 'Organic carrots per bag', 1.99, 80, 1, TRUE),
('Tomatoes', 'Fresh tomatoes per pound', 2.99, 90, 1, TRUE),
('Lettuce', 'Iceberg lettuce per head', 1.79, 60, 1, TRUE),
('Avocados', 'Hass avocados each', 1.50, 75, 1, TRUE),

-- Dairy and Eggs (category_id = 2)
('Whole Milk', 'Fresh whole milk 1 gallon', 3.99, 50, 2, TRUE),
('Cheddar Cheese', 'Sharp cheddar cheese 8oz block', 4.99, 40, 2, TRUE),
('Greek Yogurt', 'Plain Greek yogurt 32oz container', 5.49, 35, 2, TRUE),
('Large Eggs', 'Grade A large eggs dozen', 2.99, 100, 2, TRUE),
('Butter', 'Unsalted butter 1lb', 4.49, 30, 2, TRUE),
('Cream Cheese', 'Philadelphia cream cheese 8oz', 3.29, 45, 2, TRUE),

-- Meat and Seafood (category_id = 3)
('Ground Beef', 'Lean ground beef 80/20 per pound', 6.99, 25, 3, TRUE),
('Chicken Breast', 'Boneless skinless chicken breast per pound', 5.99, 30, 3, TRUE),
('Salmon Fillet', 'Fresh Atlantic salmon fillet per pound', 12.99, 15, 3, TRUE),
('Pork Chops', 'Bone-in pork chops per pound', 4.99, 20, 3, TRUE),
('Shrimp', 'Large raw shrimp 31-40 count per pound', 9.99, 18, 3, TRUE),
('Ground Turkey', 'Lean ground turkey 93/7 per pound', 5.49, 22, 3, TRUE),

-- Bakery (category_id = 4)
('White Bread', 'Sliced white bread loaf', 2.49, 40, 4, TRUE),
('Whole Wheat Bread', 'Sliced whole wheat bread loaf', 2.99, 35, 4, TRUE),
('Croissants', 'Butter croissants pack of 6', 4.99, 25, 4, TRUE),
('Bagels', 'Everything bagels pack of 6', 3.99, 30, 4, TRUE),
('Chocolate Cake', 'Double chocolate layer cake', 12.99, 8, 4, TRUE),
('Dinner Rolls', 'Soft dinner rolls pack of 8', 2.99, 20, 4, TRUE),

-- Beverages (category_id = 5)
('Orange Juice', 'Pure orange juice 64oz', 4.99, 45, 5, TRUE),
('Coca Cola', 'Coca Cola 12-pack cans', 5.99, 60, 5, TRUE),
('Bottled Water', 'Spring water 24-pack bottles', 3.99, 80, 5, TRUE),
('Coffee', 'Ground coffee 12oz bag', 8.99, 25, 5, TRUE),
('Green Tea', 'Organic green tea 20 tea bags', 4.49, 35, 5, TRUE),
('Energy Drink', 'Energy drink 16oz can', 2.99, 40, 5, TRUE);