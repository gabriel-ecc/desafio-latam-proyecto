/*
DML (Data Manipulation Language)
¿Qué es en bases de datos?
Las sentencias DML se utilizan para manipular los datos dentro de los objetos de la base de datos (tablas). Esto incluye:
  INSERT (insertar nuevas filas de datos)
  UPDATE (modificar datos existentes)
  DELETE (eliminar filas de datos)
  SELECT (consultar/recuperar datos - aunque SELECT a veces se clasifica como DQL - Data Query Language, se considera parte de DML en un sentido amplio de manipulación de datos).
*/

INSERT INTO user_type (id,name) VALUES 
(1,'cliente'),
(2,'empleado'),
(3,'administrador');

INSERT INTO security_actions (id,name) VALUES 
(1,'crear empleado'),
(2,'crear cliente'),
(3,'crear producto'),
(4,'bloquear empleado'),
(5,'bloquear cliente'),
(6,'bloquear producto'),
(7,'modificar empleado'),
(8,'modificar cliente'),
(9,'modificar producto'),
(10,'ver empleados'),
(11,'ver clientes'),
(12,'ver productos'),
(13,'ver dashboards'),
(14,'actualizar favoritos'),
(15,'editar mis datos')

INSERT INTO security_actions_roles (security_action_id,user_type_id) VALUES
(1,3),
(2,1),
(3,3),
(4,3),
(5,3),
(5,2),
(6,3),
(6,2),
(7,3),
(8,3),
(9,3),
(9,2),
(10,3),
(11,3),
(11,2),
(13,3),
(13,2),
(14,1),
(15,3),
(15,2),
(15,1)

INSERT INTO users (first_name, last_name, email, phone, password, user_type, user_status, profile_photo) VALUES 
('Admin', 'Sistema', 'admin@verduleria.cl', '+56912345678', '$2a$10$3Jg9pZ5Q8L5fW1eR3tG7h.u8K3v5Z9B1xW2mY4nO7cI6pS5rE3dG', 3, 1, '');

INSERT INTO product_category(name,description)VALUES
('Verdura','Verduras'),
('Fruta','Frutas'),
('Legumbre','Legumbres'),
('Carne','Carnes'),
('Otro','Otros');

INSERT INTO season_category(name,description)VALUES
('Verano','Verano'),
('Otoño','Otoño'),
('Invierno','Invierno'),
('Primavera','Primavera');

INSERT INTO products (name, description, price, stock, product_category_id, season_category_id, product_photo, status) VALUES
-- Verduras (10)
('Tomate Larga Vida', 'Tomate maduro y jugoso, ideal para ensaladas y salsas.', 1500, 120, 1, 1, 'tomatesLargaVida.jpeg', true),
('Lechuga Costina', 'Lechuga de hojas crujientes y frescas.', 1000, 80, 1, 4, 'LechugaCostina.webp', true),
('Zapallo Italiano', 'Zapallo tierno, perfecto para guisos y salteados.', 800, 90, 1, 1, 'zapalloItaliano.webp', true),
('Cebolla Morada', 'Cebolla de sabor más suave y dulce, ideal para ensaladas.', 1200, 150, 1, 2, 'cebollaMorada.jpeg', true),
('Pimentón Rojo', 'Pimentón grande y carnoso, de sabor dulce.', 1300, 70, 1, 1, 'pimentonRojo.webp', true),
('Brócoli', 'Brócoli fresco, rico en vitaminas.', 1600, 60, 1, 3, 'brocoli.webp', true),
('Espinaca Fresca', 'Hojas de espinaca tiernas, listas para consumir.', 1100, 50, 1, 4, 'espinacaFresca.webp', true),
('Zanahoria', 'Zanahorias frescas y dulces, perfectas para snacks y jugos.', 900, 200, 1, 2, 'zanahoria.webp', true),
('Papa Deslavada', 'Papas seleccionadas, ideales para todo tipo de preparación.', 1400, 300, 1, 3, 'papaDeslavada.jpeg', true),
('Ajo Chilote', 'Cabeza de ajo grande de sabor intenso.', 2000, 40, 1, 3, 'ajoChilote.jpeg', true),

-- Frutas (15)
('Manzana Fuji', 'Manzana dulce y crujiente, de origen nacional.', 1800, 100, 2, 2, 'manzanaFuji.webp', true),
('Plátano', 'Plátano maduro, fuente de potasio.', 1300, 150, 2, 1, 'platano.jpeg', true),
('Frutilla', 'Frutillas frescas y dulces de temporada.', 2500, 60, 2, 4, 'frutilla.jpeg', true),
('Naranja para Jugo', 'Naranjas jugosas, perfectas para exprimir.', 1600, 110, 2, 3, 'naranjaParaJugo.webp', true),
('Limón de Pica', 'Limón pequeño y muy jugoso, con alta acidez.', 1700, 90, 2, 1, 'limonDePica.webp', true),
('Uva Red Globe', 'Uva grande y sin pepa, de sabor dulce.', 2200, 70, 2, 1, 'uvaRedGlobe.webp', true),
('Pera de Agua', 'Pera jugosa y refrescante.', 1500, 85, 2, 2, 'peraDeAgua.jpeg', true),
('Kiwi', 'Kiwi verde, rico en vitamina C.', 1900, 95, 2, 2, 'kiwi.jpeg', true),
('Durazno Conservero', 'Duraznos grandes y firmes, ideales para conserva o consumo fresco.', 2100, 55, 2, 1, 'durazno.webp', true),
('Sandía', 'Sandía grande y jugosa, perfecta para el verano.', 4500, 30, 2, 1, 'sandia.png', true),
('Cereza', 'Cerezas frescas de exportación.', 3000, 40, 2, 4, 'cereza.png', true),
('Mandarina', 'Mandarinas fáciles de pelar y muy dulces.', 1400, 130, 2, 3, 'mandarina.webp', true),
('Melón Tuna', 'Melón de pulpa anaranjada y dulce.', 2800, 25, 2, 1, 'melonTuna.jpg', true),
('Palta Hass', 'Palta cremosa de primera calidad.', 4000, 80, 2, 4, 'paltaHass.webp', true),
('Piña Cayena Lisa', 'Piña tropical dulce y jugosa.', 2500, 50, 2, 1, 'pinaCayenaLisa.jpeg', true),

-- Carnes (10)
('Lomo Liso de Vacuno', 'Corte de vacuno premium, ideal para la parrilla.', 15000, 40, 4, 1, 'lomoLisoDeVacuno.webp', true),
('Pechuga de Pollo Entera', 'Pechuga de pollo sin piel y sin hueso.', 7000, 60, 4, 2, 'pechugaDePolloEntera.webp', true),
('Costillar de Cerdo', 'Costillar de cerdo ideal para asar al horno o a la parrilla.', 9000, 35, 4, 3, 'costillarDeCerdo.webp', true),
('Carne Molida de Vacuno (4% grasa)', 'Carne molida magra, perfecta para salsas y rellenos.', 6500, 70, 4, 4, 'carneMolidaDeVacuno.webp', true),
('Trutro Entero de Pollo', 'Trutros de pollo, jugosos y económicos.', 5000, 80, 4, 1, 'trutroEnteroDePollo.webp', true),
('Chuleta de Cerdo Vetada', 'Chuleta de cerdo con veta de grasa para mayor sabor.', 8000, 50, 4, 2, 'chuletaDeCerdoVetada.webp', true),
('Posta Negra de Vacuno', 'Corte magro de vacuno, ideal para bistec o cacerola.', 11000, 45, 4, 3, 'postaNegraDeVacuno.webp', true),
('Longaniza Artesanal', 'Longaniza de Chillán, con receta tradicional.', 8500, 55, 4, 4, 'longanizaArtesanal.webp', true),
('Salmón Fresco', 'Filete de salmón fresco del sur de Chile.', 18000, 20, 4, 3, 'salmonFresco.webp', true),
('Hamburguesa Casera de Vacuno', 'Hamburguesas preparadas con carne de vacuno seleccionada.', 6000, 40, 4, 1, 'hamburguesaCaseraDeVacuno.webp', true),

-- Legumbres (5)
('Lentejas 6mm', 'Lentejas de calidad, base para guisos nutritivos.', 2200, 100, 3, 3, 'lentejasSeismm.webp', true),
('Porotos Negros', 'Porotos negros ideales para cocina tradicional y mexicana.', 2500, 90, 3, 3, 'porotosNegros.webp', true),
('Garbanzos', 'Garbanzos seleccionados, perfectos para ensaladas y hummus.', 2400, 80, 3, 3, 'garbanzos.webp', true),
('Porotos Tórtola', 'Clásicos porotos para preparar con riendas.', 2600, 70, 3, 3, 'porotosTortola.webp', true),
('Arveja Partida', 'Arveja seca partida, ideal para cremas y purés.', 2100, 110, 3, 3, 'arvejaPartida.webp', true);