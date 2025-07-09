DROP DATABASE IF EXISTS carrito;
CREATE DATABASE carrito;
USE carrito;

CREATE TABLE persona(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    edad INT CHECK (edad >= 0),
    correo VARCHAR(100) UNIQUE NOT NULL,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE categoria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    estado ENUM('Activa', 'Inactiva') DEFAULT 'Activa'
);

CREATE TABLE tarea(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado ENUM('Agendada', 'Cumplida', 'Cancelada') DEFAULT 'Agendada',
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    categoria_id INT,
    persona_id INT,
    CONSTRAINT fk_tarea_categoria_id FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_tarea_persona_id FOREIGN KEY (persona_id) REFERENCES persona(id)
);

-- dml
INSERT INTO persona (nombre, apellido, edad, correo, usuario, contrasena) VALUES
('Juan', 'Pérez', 30, 'juan23@gmail.com','user_a7f3', 'pass_1b2c3d'),
('Ana', 'Gómez', 25, 'ana34@gmail.com','user_9x2y', 'pass_4e5f6g'),
('Luis', 'Martínez', 40, 'luis40@gmail.com','user_q8w7', 'pass_7h8i9j'),
('María', 'Rodríguez', 28, 'maria28@gmail.com','user_z1x2', 'pass_0k1l2m'),
('Carlos', 'Sánchez', 35, 'carlos35@gmail.com','user_v3b4', 'pass_3n4o5p'),
('Laura', 'Fernández', 22, 'laura22@gmail.com','user_t5r6', 'pass_6q7r8s'),
('Pedro', 'López', 31, 'pedro31@gmail.com','user_m8n9', 'pass_9t0u1v'),
('Sofía', 'Díaz', 27, 'sofia27@gmail.com','user_c2d3', 'pass_2w3x4y'),
('Miguel', 'Torres', 29, 'miguel29@gmail.com','user_k4l5', 'pass_5z6a7b'),
('Lucía', 'Ramírez', 24, 'lucia24@gmail.com','user_s6t7', 'pass_8c9d0e'),
('Jorge', 'Morales', 33, 'jorge33@gmail.com','user_g8h9', 'pass_1f2g3h'),
('Elena', 'Jiménez', 26, 'elena26@gmail.com','user_p0q1', 'pass_4i5j6k'),
('Andrés', 'Ruiz', 38, 'andres38@gmail.com','user_w2e3', 'pass_7l8m9n'),
('Paula', 'Hernández', 23, 'paula23@gmail.com','user_u4i5', 'pass_0o1p2q'),
('Diego', 'Castro', 36, 'diego36@gmail.com','user_o6p7', 'pass_3r4s5t'),
('Valeria', 'Ortiz', 21, 'valeria21@gmail.com','user_e8r9', 'pass_6u7v8w'),
('Manuel', 'Vargas', 32, 'manuel32@gmail.com','user_y0u1', 'pass_9x0y1z'),
('Camila', 'Silva', 29, 'camila29@gmail.com','user_b2n3', 'pass_2a3b4c'),
('Gabriel', 'Molina', 34, 'gabriel34@gmail.com','user_f4m5', 'pass_5d6e7f'),
('Isabel', 'Rojas', 28, 'isabel28@gmail.com','user_j6k7', 'pass_8g9h0i');

INSERT INTO categoria (nombre, descripcion, estado) VALUES
('Trabajo', 'Tareas relacionadas con el trabajo', 'Activa'),
('Estudio', 'Tareas académicas y de estudio', 'Activa'),
('Hogar', 'Tareas del hogar y mantenimiento', 'Inactiva'),
('Salud', 'Actividades relacionadas con la salud y el bienestar', 'Activa'),
('Ocio', 'Actividades recreativas y de ocio', 'Activa');

INSERT INTO tarea (nombre, descripcion, estado, fecha_inicio, fecha_fin, categoria_id, persona_id) VALUES
('Reunión con el equipo', 'Reunión semanal para revisar el progreso del proyecto', 'Agendada', '2023-10-01', '2023-10-01', 1, 1),
('Estudiar matemáticas', 'Preparación para el examen de matemáticas del viernes', 'Cumplida', '2023-09-25', '2023-09-30', 2, 2),
('Limpieza de la casa', 'Limpieza general de la casa y organización de espacios', 'Cancelada', '2023-10-02', '2023-10-03', 3, 3),
('Cita médica', 'Consulta médica anual con el doctor Pérez', 'Agendada', '2023-10-05', '2023-10-05', 4, 4),
('Ver una película', 'Disfrutar de una película en casa con amigos', 'Agendada', '2023-10-07', '2023-10-07', 5, 5),

-- 15 tareas adicionales para el usuario con persona_id = 1
('Planificar sprint', 'Definir tareas para el próximo sprint', 'Agendada', '2023-10-08', '2023-10-08', 1, 1),
('Enviar informe', 'Enviar informe mensual al jefe', 'Cumplida', '2023-09-28', '2023-09-28', 1, 1),
('Actualizar documentación', 'Actualizar la documentación del proyecto', 'Agendada', '2023-10-10', '2023-10-10', 1, 1),
('Revisar código', 'Revisión de código de los compañeros', 'Cumplida', '2023-09-29', '2023-09-29', 1, 1),
('Capacitación interna', 'Asistir a capacitación sobre nuevas tecnologías', 'Agendada', '2023-10-12', '2023-10-12', 1, 1),
('Organizar archivos', 'Organizar archivos en la computadora', 'Agendada', '2023-10-13', '2023-10-13', 1, 1),
('Reunión con cliente', 'Presentar avances al cliente', 'Agendada', '2023-10-15', '2023-10-15', 1, 1),
('Preparar presentación', 'Preparar presentación para la junta', 'Cumplida', '2023-09-27', '2023-09-27', 1, 1),
('Actualizar CV', 'Actualizar currículum vitae', 'Agendada', '2023-10-16', '2023-10-16', 1, 1),
('Leer documentación', 'Leer documentación de la nueva API', 'Agendada', '2023-10-17', '2023-10-17', 1, 1),
('Configurar entorno', 'Configurar entorno de desarrollo', 'Cumplida', '2023-09-26', '2023-09-26', 1, 1),
('Revisar presupuesto', 'Revisar presupuesto del proyecto', 'Agendada', '2023-10-18', '2023-10-18', 1, 1),
('Enviar propuestas', 'Enviar propuestas a nuevos clientes', 'Agendada', '2023-10-19', '2023-10-19', 1, 1),
('Reunión de seguimiento', 'Reunión para seguimiento de tareas', 'Agendada', '2023-10-20', '2023-10-20', 1, 1),
('Evaluar desempeño', 'Evaluar desempeño del equipo', 'Agendada', '2023-10-21', '2023-10-21', 1, 1),

-- Tareas para persona_id = 2
('Leer libro de historia', 'Leer el capítulo 3 del libro de historia', 'Agendada', '2023-10-02', '2023-10-03', 2, 2),
('Hacer ejercicio', 'Rutina de ejercicios de 30 minutos', 'Cumplida', '2023-09-28', '2023-09-28', 4, 2),
('Organizar apuntes', 'Organizar apuntes de la clase de matemáticas', 'Agendada', '2023-10-04', '2023-10-04', 2, 2),
('Preparar exposición', 'Preparar exposición para la clase de biología', 'Agendada', '2023-10-06', '2023-10-06', 2, 2),
('Ir al cine', 'Ver la nueva película de estreno', 'Agendada', '2023-10-08', '2023-10-08', 5, 2),

-- Tareas para persona_id = 3
('Reparar grifo', 'Arreglar el grifo que gotea en la cocina', 'Agendada', '2023-10-03', '2023-10-03', 3, 3),
('Pagar facturas', 'Pagar facturas de servicios públicos', 'Cumplida', '2023-09-29', '2023-09-29', 3, 3),
('Cocinar cena especial', 'Preparar una cena especial para la familia', 'Agendada', '2023-10-05', '2023-10-05', 3, 3),
('Salir a caminar', 'Paseo de 1 hora por el parque', 'Agendada', '2023-10-07', '2023-10-07', 4, 3),
('Ver serie', 'Ver dos capítulos de la serie favorita', 'Agendada', '2023-10-09', '2023-10-09', 5, 3),

-- Tareas para persona_id = 4
('Control de salud', 'Chequeo médico general', 'Agendada', '2023-10-10', '2023-10-10', 4, 4),
('Estudiar inglés', 'Repasar vocabulario y gramática', 'Cumplida', '2023-09-30', '2023-09-30', 2, 4),
('Limpiar habitación', 'Limpieza profunda de la habitación', 'Agendada', '2023-10-12', '2023-10-12', 3, 4),
('Jugar fútbol', 'Partido amistoso con amigos', 'Agendada', '2023-10-14', '2023-10-14', 5, 4),
('Enviar correo', 'Enviar correo importante al profesor', 'Agendada', '2023-10-16', '2023-10-16', 2, 4),

-- Tareas para persona_id = 5
('Actualizar agenda', 'Actualizar la agenda semanal', 'Agendada', '2023-10-11', '2023-10-11', 1, 5),
('Hacer compras', 'Comprar víveres para la semana', 'Cumplida', '2023-09-27', '2023-09-27', 3, 5),
('Preparar desayuno', 'Preparar desayuno saludable', 'Agendada', '2023-10-13', '2023-10-13', 4, 5),
('Leer novela', 'Leer un capítulo de la novela favorita', 'Agendada', '2023-10-15', '2023-10-15', 5, 5),
('Estudiar programación', 'Resolver ejercicios de SQL', 'Agendada', '2023-10-17', '2023-10-17', 2, 5);


SELECT 
	t.id, t.nombre, t.descripcion, t.estado, t.fecha_inicio, t.fecha_fin, c.nombre AS categoria, p.nombre AS persona
FROM tarea t
JOIN categoria c ON t.categoria_id = c.id
JOIN persona p ON t.persona_id = p.id
WHERE p.id = 2; -- Cambia el ID de la persona según sea necesario