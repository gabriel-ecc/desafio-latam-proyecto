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

/*
CREATE TABLE usuarios
(
    id serial NOT NULL,
	  nameLastName character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(60) COLLATE pg_catalog."default" NOT NULL,
    rol character varying(25) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_email_key UNIQUE (email)
)
*/

