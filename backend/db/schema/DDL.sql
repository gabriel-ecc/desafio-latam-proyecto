/* 
DDL (Data Definition Language)
Las sentencias DDL se utilizan para definir o modificar la estructura de la base de datos. Esto incluye la creación, modificación y eliminación de objetos de la base de datos como:
  CREATE TABLE (crear una tabla)
  ALTER TABLE (modificar la estructura de una tabla)
  DROP TABLE (eliminar una tabla)
  CREATE INDEX (crear un índice)
  CREATE DATABASE (crear una base de datos)
*/

CREATE DATABASE verduleria;
\c verduleria;


/* user_type: 1 = cliente, 2 = empleado, 3 = admin */
CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(500) NOT NULL,
    user_type INT NOT NULL,
    user_status INT NOT NULL,
    profile_photo VARCHAR(1000) NOT NULL DEFAULT '',
    create_date TIMESTAMP NOT NULL DEFAULT NOW(),
    update_date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_key UNIQUE (email)
);




