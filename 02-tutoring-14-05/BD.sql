-- Construir base de datos de carrito compras

-- Eliminarr la base de datos, si existe. 
DROP DATABASE IF EXISTS carrito;

-- Crear la base de datos
CREATE DATABASE carrito;

-- Usar base de datos 
USE carrito;

-- Crear entidades
CREATE TABLE persona(
	id INT PRIMARY KEY AUTO_INCREMENT,
	primer_nombre varchar(20) NOT NULL,
	segundo_nombre varchar(20),
	primer_apellido varchar(20) NOT NULL,
	segundo_apellido varchar(20),
	correo varchar(50) NOT NULL,
	direccion varchar(50) NOT NULL
);
	
CREATE TABLE rol(
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(50) NOT NULL,
	descripcion varchar(100)
);
		
CREATE TABLE usuario(
	id INT PRIMARY KEY AUTO_INCREMENT,
	usuario varchar(50) NOT NULL,
	contrasenia varchar(50) NOT NULL,
	persona_id INT UNIQUE NOT NULL,
	rol_id INT UNIQUE NOT NULL,
	FOREIGN KEY (persona_id) REFERENCES persona(id),
	FOREIGN KEY (rol_id) REFERENCES rol(id)
);


	
CREATE TABLE producto(
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(50) NOT NULL,
	descripcion varchar(100),
	stock DECIMAL(5,2) NOT NULL,
	valor_unitario DECIMAL(5,2) NOT NULL
);

CREATE TABLE factura(
	id INT PRIMARY KEY AUTO_INCREMENT,
	fecha DATE NOT NULL,
	valor_total	DECIMAL(5,2) NOT NULL,
	usuario_id INT NOT NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE factura_detalle(
	id INT PRIMARY KEY AUTO_INCREMENT,
	cantidad INT NOT NULL,
	producto_id INT NOT NULL,
	factura_id INT NOT NULL,
	FOREIGN KEY (producto_id) REFERENCES producto(id),
	FOREIGN KEY (factura_id) REFERENCES factura(id)
);