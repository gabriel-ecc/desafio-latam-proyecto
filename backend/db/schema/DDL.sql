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

CREATE TABLE user_type(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE security_actions(
    id SERIAL PRIMARY KEY NOT NULL,
    security_route VARCHAR(200) NOT NULL,
    security_method VARCHAR(10) NOT NULL,
    description VARCHAR(500) NOT NULL DEFAULT '',
    create_date TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE security_actions_roles(
    id SERIAL PRIMARY KEY NOT NULL,
    user_type_id INT NOT NULL,
    security_action_id INT NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT security_actions_roles_user_type_fkey FOREIGN KEY (user_type_id) REFERENCES user_type(id),
    CONSTRAINT security_actions_roles_security_action_fkey FOREIGN KEY (security_action_id) REFERENCES security_actions(id)
)



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
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_user_type_fkey FOREIGN KEY (user_type) REFERENCES user_type(id)
);

CREATE TABLE product_category(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE season_category(
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    create_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products(
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    product_category_id INT NOT NULL,
    season_category_id INT NOT NULL,
    product_photo VARCHAR(1000) NOT NULL DEFAULT '',
    status BOOL,
    create_date TIMESTAMP NOT NULL DEFAULT NOW(),
    update_date TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT products_name_key UNIQUE (name),
    CONSTRAINT products_price_check CHECK (price > 0),
    CONSTRAINT products_stock_check CHECK (stock >= 0),
    CONSTRAINT products_product_category_fkey FOREIGN KEY (product_category_id) REFERENCES product_category(id),
    CONSTRAINT products_seasonal_category_fkey FOREIGN KEY (season_category_id) REFERENCES season_category(id)

);


