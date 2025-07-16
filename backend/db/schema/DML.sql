/*
DML (Data Manipulation Language)
¿Qué es en bases de datos?
Las sentencias DML se utilizan para manipular los datos dentro de los objetos de la base de datos (tablas). Esto incluye:
  INSERT (insertar nuevas filas de datos)
  UPDATE (modificar datos existentes)
  DELETE (eliminar filas de datos)
  SELECT (consultar/recuperar datos - aunque SELECT a veces se clasifica como DQL - Data Query Language, se considera parte de DML en un sentido amplio de manipulación de datos).
*/

INSERT INTO users (id, first_name, last_name, email, phone, password, user_type, user_status, profile_photo) VALUES ('0c1dd659-5b04-4bb8-b278-2ecf14fde11a', 'Admin', 'Sistema', 'admin@verduleria.cl', '+56912345678', '$2a$10$3Jg9pZ5Q8L5fW1eR3tG7h.u8K3v5Z9B1xW2mY4nO7cI6pS5rE3dG', 3, 1, '');