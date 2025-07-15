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

INSERT INTO product_category(name,description)VALUES('Verdura','Verduras');
INSERT INTO product_category(name,description)VALUES('Fruta','Frutas');
INSERT INTO product_category(name,description)VALUES('Legumbre','Legumbres');
INSERT INTO product_category(name,description)VALUES('Carne','Carnes');
INSERT INTO product_category(name,description)VALUES('Otro','Otros');

INSERT INTO season_category(name,description)VALUES('Verano','Verano');
INSERT INTO season_category(name,description)VALUES('Otoño','Otoño'); 
INSERT INTO season_category(name,description)VALUES('Invierno','Invierno');
INSERT INTO season_category(name,description)VALUES('Primavera','Primavera');

INSERT INTO products (name, description, price, stock, product_category_id, season_category_id, product_photo, status) VALUES
-- Verduras (10)
('Tomate Larga Vida', 'Tomate maduro y jugoso, ideal para ensaladas y salsas.', 1500, 120, 1, 1, 'https://jumbocl.vtexassets.com/arquivos/ids/297810-900-900?width=900&height=900&aspect=true', true),
('Lechuga Costina', 'Lechuga de hojas crujientes y frescas.', 1000, 80, 1, 4, 'https://example.com/photos/lechuga.jpg', true),
('Zapallo Italiano', 'Zapallo tierno, perfecto para guisos y salteados.', 800, 90, 1, 1, 'https://example.com/photos/zapallo_italiano.jpg', true),
('Cebolla Morada', 'Cebolla de sabor más suave y dulce, ideal para ensaladas.', 1200, 150, 1, 2, 'https://example.com/photos/cebolla_morada.jpg', true),
('Pimentón Rojo', 'Pimentón grande y carnoso, de sabor dulce.', 1300, 70, 1, 1, 'https://example.com/photos/pimenton_rojo.jpg', true),
('Brócoli', 'Brócoli fresco, rico en vitaminas.', 1600, 60, 1, 3, 'https://example.com/photos/brocoli.jpg', true),
('Espinaca Fresca', 'Hojas de espinaca tiernas, listas para consumir.', 1100, 50, 1, 4, 'https://example.com/photos/espinaca.jpg', true),
('Zanahoria', 'Zanahorias frescas y dulces, perfectas para snacks y jugos.', 900, 200, 1, 2, 'https://example.com/photos/zanahoria.jpg', true),
('Papa Deslavada', 'Papas seleccionadas, ideales para todo tipo de preparación.', 1400, 300, 1, 3, 'https://example.com/photos/papa.jpg', true),
('Ajo Chilote', 'Cabeza de ajo grande de sabor intenso.', 2000, 40, 1, 3, 'https://example.com/photos/ajo.jpg', true),

-- Frutas (15)
('Manzana Fuji', 'Manzana dulce y crujiente, de origen nacional.', 1800, 100, 2, 2, 'https://example.com/photos/manzana_fuji.jpg', true),
('Plátano', 'Plátano maduro, fuente de potasio.', 1300, 150, 2, 1, 'https://example.com/photos/platano.jpg', true),
('Frutilla', 'Frutillas frescas y dulces de temporada.', 2500, 60, 2, 4, 'https://example.com/photos/frutilla.jpg', true),
('Naranja para Jugo', 'Naranjas jugosas, perfectas para exprimir.', 1600, 110, 2, 3, 'https://example.com/photos/naranja.jpg', true),
('Limón de Pica', 'Limón pequeño y muy jugoso, con alta acidez.', 1700, 90, 2, 1, 'https://example.com/photos/limon.jpg', true),
('Uva Red Globe', 'Uva grande y sin pepa, de sabor dulce.', 2200, 70, 2, 1, 'https://example.com/photos/uva.jpg', true),
('Pera de Agua', 'Pera jugosa y refrescante.', 1500, 85, 2, 2, 'https://example.com/photos/pera.jpg', true),
('Kiwi', 'Kiwi verde, rico en vitamina C.', 1900, 95, 2, 2, 'https://example.com/photos/kiwi.jpg', true),
('Durazno Conservero', 'Duraznos grandes y firmes, ideales para conserva o consumo fresco.', 2100, 55, 2, 1, 'https://example.com/photos/durazno.jpg', true),
('Sandía', 'Sandía grande y jugosa, perfecta para el verano.', 4500, 30, 2, 1, 'https://example.com/photos/sandia.jpg', true),
('Cereza', 'Cerezas frescas de exportación.', 3000, 40, 2, 4, 'https://example.com/photos/cereza.jpg', true),
('Mandarina', 'Mandarinas fáciles de pelar y muy dulces.', 1400, 130, 2, 3, 'https://example.com/photos/mandarina.jpg', true),
('Melón Tuna', 'Melón de pulpa anaranjada y dulce.', 2800, 25, 2, 1, 'https://example.com/photos/melon.jpg', true),
('Palta Hass', 'Palta cremosa de primera calidad.', 4000, 80, 2, 4, 'https://example.com/photos/palta.jpg', true),
('Piña Cayena Lisa', 'Piña tropical dulce y jugosa.', 2500, 50, 2, 1, 'https://example.com/photos/pina.jpg', true),

-- Carnes (10)
('Lomo Liso de Vacuno', 'Corte de vacuno premium, ideal para la parrilla.', 15000, 40, 4, 1, 'https://example.com/photos/lomo_liso.jpg', true),
('Pechuga de Pollo Entera', 'Pechuga de pollo sin piel y sin hueso.', 7000, 60, 4, 2, 'https://example.com/photos/pechuga_pollo.jpg', true),
('Costillar de Cerdo', 'Costillar de cerdo ideal para asar al horno o a la parrilla.', 9000, 35, 4, 3, 'https://example.com/photos/costillar_cerdo.jpg', true),
('Carne Molida de Vacuno (5% grasa)', 'Carne molida magra, perfecta para salsas y rellenos.', 6500, 70, 4, 4, 'https://example.com/photos/carne_molida.jpg', true),
('Trutro Entero de Pollo', 'Trutros de pollo, jugosos y económicos.', 5000, 80, 4, 1, 'https://example.com/photos/trutro_pollo.jpg', true),
('Chuleta de Cerdo Vetada', 'Chuleta de cerdo con veta de grasa para mayor sabor.', 8000, 50, 4, 2, 'https://example.com/photos/chuleta_cerdo.jpg', true),
('Posta Negra de Vacuno', 'Corte magro de vacuno, ideal para bistec o cacerola.', 11000, 45, 4, 3, 'https://example.com/photos/posta_negra.jpg', true),
('Longaniza Artesanal', 'Longaniza de Chillán, con receta tradicional.', 8500, 55, 4, 4, 'https://example.com/photos/longaniza.jpg', true),
('Salmón Fresco', 'Filete de salmón fresco del sur de Chile.', 18000, 20, 4, 3, 'https://example.com/photos/salmon.jpg', true),
('Hamburguesa Casera de Vacuno', 'Hamburguesas preparadas con carne de vacuno seleccionada.', 6000, 40, 4, 1, 'https://example.com/photos/hamburguesa.jpg', true),

-- Legumbres (5)
('Lentejas 6mm', 'Lentejas de calidad, base para guisos nutritivos.', 2200, 100, 3, 3, 'https://example.com/photos/lentejas.jpg', true),
('Porotos Negros', 'Porotos negros ideales para cocina tradicional y mexicana.', 2500, 90, 3, 3, 'https://example.com/photos/porotos_negros.jpg', true),
('Garbanzos', 'Garbanzos seleccionados, perfectos para ensaladas y hummus.', 2400, 80, 3, 3, 'https://example.com/photos/garbanzos.jpg', true),
('Porotos Tórtola', 'Clásicos porotos para preparar con riendas.', 2600, 70, 3, 3, 'https://example.com/photos/porotos_tortola.jpg', true),
('Arveja Partida', 'Arveja seca partida, ideal para cremas y purés.', 2100, 110, 3, 3, 'https://example.com/photos/arveja_partida.jpg', true);