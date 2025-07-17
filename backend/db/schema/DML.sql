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
('Tomate Larga Vida', 'Tomate maduro y jugoso, ideal para ensaladas y salsas.', 1500, 120, 1, 1, 'uploads/tomatesLargaVida.jpeg', true),
('Lechuga Costina', 'Lechuga de hojas crujientes y frescas.', 1000, 80, 1, 4, 'uploads/LechugaCostina.webp', true),
('Zapallo Italiano', 'Zapallo tierno, perfecto para guisos y salteados.', 800, 90, 1, 1, 'uploads/zapalloItaliano.webp', true),
('Cebolla Morada', 'Cebolla de sabor más suave y dulce, ideal para ensaladas.', 1200, 150, 1, 2, 'uploads/cebollaMorada.jpeg', true),
('Pimentón Rojo', 'Pimentón grande y carnoso, de sabor dulce.', 1300, 70, 1, 1, 'uploads/pimentonRojo.webp', true),
('Brócoli', 'Brócoli fresco, rico en vitaminas.', 1600, 60, 1, 3, 'uploads/brocoli.webp', true),
('Espinaca Fresca', 'Hojas de espinaca tiernas, listas para consumir.', 1100, 50, 1, 4, 'uploads/espinacaFresca.webp', true),
('Zanahoria', 'Zanahorias frescas y dulces, perfectas para snacks y jugos.', 900, 200, 1, 2, 'uploads/zanahoria.webp', true),
('Papa Deslavada', 'Papas seleccionadas, ideales para todo tipo de preparación.', 1400, 300, 1, 3, 'uploads/papaDeslavada.jpeg', true),
('Ajo Chilote', 'Cabeza de ajo grande de sabor intenso.', 2000, 40, 1, 3, 'uploads/ajoChilote.jpeg', true),

-- Frutas (15)
('Manzana Fuji', 'Manzana dulce y crujiente, de origen nacional.', 1800, 100, 2, 2, 'uploads/manzanaFuji.webp', true),
('Plátano', 'Plátano maduro, fuente de potasio.', 1300, 150, 2, 1, 'uploads/platano.jpeg', true),
('Frutilla', 'Frutillas frescas y dulces de temporada.', 2500, 60, 2, 4, 'uploads/frutilla.jpeg', true),
('Naranja para Jugo', 'Naranjas jugosas, perfectas para exprimir.', 1600, 110, 2, 3, 'uploads/naranjaParaJugo.webp', true),
('Limón de Pica', 'Limón pequeño y muy jugoso, con alta acidez.', 1700, 90, 2, 1, 'uploads/limonDePica.webp', true),
('Uva Red Globe', 'Uva grande y sin pepa, de sabor dulce.', 2200, 70, 2, 1, 'uploads/uvaRedGlobe.webp', true),
('Pera de Agua', 'Pera jugosa y refrescante.', 1500, 85, 2, 2, 'uploads/peraDeAgua.jpeg', true),
('Kiwi', 'Kiwi verde, rico en vitamina C.', 1900, 95, 2, 2, 'uploads/kiwi.jpeg', true),
('Durazno Conservero', 'Duraznos grandes y firmes, ideales para conserva o consumo fresco.', 2100, 55, 2, 1, 'uploads/durazno.webp', true),
('Sandía', 'Sandía grande y jugosa, perfecta para el verano.', 4500, 30, 2, 1, 'uploads/sandia.png', true),
('Cereza', 'Cerezas frescas de exportación.', 3000, 40, 2, 4, 'uploads/cereza.png', true),
('Mandarina', 'Mandarinas fáciles de pelar y muy dulces.', 1400, 130, 2, 3, 'uploads/mandarina.webp', true),
('Melón Tuna', 'Melón de pulpa anaranjada y dulce.', 2800, 25, 2, 1, 'uploads/melonTuna.jpg', true),
('Palta Hass', 'Palta cremosa de primera calidad.', 4000, 80, 2, 4, 'uploads/paltaHass.webp', true),
('Piña Cayena Lisa', 'Piña tropical dulce y jugosa.', 2500, 50, 2, 1, 'uploads/pinaCayenaLisa.jpeg', true),

-- Carnes (10)
('Lomo Liso de Vacuno', 'Corte de vacuno premium, ideal para la parrilla.', 15000, 40, 4, 1, 'uploads/lomoLisoDeVacuno.webp', true),
('Pechuga de Pollo Entera', 'Pechuga de pollo sin piel y sin hueso.', 7000, 60, 4, 2, 'uploads/pechugaDePolloEntera.webp', true),
('Costillar de Cerdo', 'Costillar de cerdo ideal para asar al horno o a la parrilla.', 9000, 35, 4, 3, 'uploads/costillarDeCerdo.webp', true),
('Carne Molida de Vacuno (4% grasa)', 'Carne molida magra, perfecta para salsas y rellenos.', 6500, 70, 4, 4, 'uploads/carneMolidaDeVacuno.webp', true),
('Trutro Entero de Pollo', 'Trutros de pollo, jugosos y económicos.', 5000, 80, 4, 1, 'uploads/trutroEnteroDePollo.webp', true),
('Chuleta de Cerdo Vetada', 'Chuleta de cerdo con veta de grasa para mayor sabor.', 8000, 50, 4, 2, 'uploads/chuletaDeCerdoVetada.webp', true),
('Posta Negra de Vacuno', 'Corte magro de vacuno, ideal para bistec o cacerola.', 11000, 45, 4, 3, 'uploads/postaNegraDeVacuno.webp', true),
('Longaniza Artesanal', 'Longaniza de Chillán, con receta tradicional.', 8500, 55, 4, 4, 'uploads/longanizaArtesanal.webp', true),
('Salmón Fresco', 'Filete de salmón fresco del sur de Chile.', 18000, 20, 4, 3, 'uploads/salmonFresco.webp', true),
('Hamburguesa Casera de Vacuno', 'Hamburguesas preparadas con carne de vacuno seleccionada.', 6000, 40, 4, 1, 'uploads/hamburguesaCaseraDeVacuno.webp', true),

-- Legumbres (5)
('Lentejas 6mm', 'Lentejas de calidad, base para guisos nutritivos.', 2200, 100, 3, 3, 'uploads/lentejasSeismm.webp', true),
('Porotos Negros', 'Porotos negros ideales para cocina tradicional y mexicana.', 2500, 90, 3, 3, 'uploads/porotosNegros.webp', true),
('Garbanzos', 'Garbanzos seleccionados, perfectos para ensaladas y hummus.', 2400, 80, 3, 3, 'uploads/garbanzos.webp', true),
('Porotos Tórtola', 'Clásicos porotos para preparar con riendas.', 2600, 70, 3, 3, 'uploads/porotosTortola.webp', true),
('Arveja Partida', 'Arveja seca partida, ideal para cremas y purés.', 2100, 110, 3, 3, 'uploads/arvejaPartida.webp', true);