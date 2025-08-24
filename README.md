# 1. Proyecto final bootcamp Desafío Latam

Este repositorio contiene el código fuente del "Proyecto Final Desafío Latam", está desarrollado con un backend en express.js y frontend con react.js.

### Tabla de Contenidos

- [1. Proyecto final bootcamp Desafío Latam](#1-proyecto-final-bootcamp-desafío-latam)
  - [1.1 Nombre de Proyecto](#11-nombre-de-proyecto)
  - [1.2 Concepto](#12-concepto)
  - [1.3 Descripción](#13-descripción)
  - [1.4 Equipo de proyecto](#14-equipo-de-proyecto)
- [2. Github](#2-github)
  - [2.1 Página del proyecto en Github](#21-página-del-proyecto-en-github)
  - [2.2 Gestión del proyecto](#22-gestión-del-proyecto)
- [3. Implementación](#3-implementación)
  - [3.1 Crear Base de datos](#31-crear-base-de-datos)
  - [3.2 Instalacion de dependencias](#32-instalacion-de-dependencias)
  - [3.3 Variables de entorno](#33-variables-de-entorno)
  - [3.4 Ejecución (servidores)](#34-ejecución-servidores)
  - [3.5 Login Usuarios de prueba (3)](#35-login-usuarios-de-prueba-3)
  - [3.6 Testing con Jest/supertest](#36-testing-con-jestsupertest)
- [4. Documentacion API](#7-documentacion-api)
  - [4.1 Swagger](#71-swagger)
- [5. Tech Stack](#8-tech-stack)
- [6. Dependencias](#9-dependencias)
  - [6.1 Dependencias del Backend](#91-dependencias-del-backend)
  - [6.2 Dependencias de Desarrollo del Backend](#92-dependencias-de-desarrollo-del-backend)
  - [6.3 Dependencias del Frontend](#93-dependencias-del-frontend)
  - [6.4 Dependencias de Desarrollo del Frontend](#94-dependencias-de-desarrollo-del-frontend)

---

## 1.1 Nombre de Proyecto:

"Verdulería La Gata de Campo"

## 1.2 Concepto

Este es un ecommerce de una verduleria.
Considera gestión de productos, administración de usuarios, favoritos y carrito de compra.

## 1.3 Descripción

La gata de campo es una verdulería online de confianza, donde la frescura del campo llega directamente a tu hogar. Ofrecemos una amplia variedad de frutas y verduras frescas y de la más alta calidad, seleccionadas cuidadosamente para ti.

En nuestra tienda virtual, encontrarás una experiencia de compra sencilla y segura. Puedes navegar por nuestro catálogo, agregar tus productos favoritos al carrito y pagar de forma rápida con tu tarjeta de crédito o débito. Además, para que no pierdas de vista esos productos que te encantan, puedes guardarlos en tu lista de favoritos y acceder a ellos fácilmente en cualquier momento.

Únete a la familia de "La gata de campo" y disfruta de la comodidad de comprar y recibir productos frescos y deliciosos en nuestro, con la calidad y el servicio que mereces.

El proximo año, queremos entregarte a domicilio!

## 1.4 Equipo de proyecto:

- Carla Pacheco
- Andreina Gutierrez
- Gabriel Castillo
- Oscar Garin

# 2. Github

## 2.1 Página del proyecto en Github:

https://github.com/gabriel-ecc/desafio-latam-proyecto

## 2.2 Gestión del proyecto:

https://github.com/users/gabriel-ecc/projects/2

# 3. Implementación

Para realizar una implementación local del software, se deben seguir los siguiente pasos.

## 3.1 Crear Base de datos

Se requiere un servidor de postgres y seguir los siguientes pasos:

1. Crear base de datos: sugerimos usar el nombre **verduleria**

2. Instalar estructura de datos:

```
./backend/db/schema/DDL.sql
```

3. Instalar datos de perfilamiento y elementos iniciales:

```
./backend/db/schema/DML.sql
```

## 3.2 Instalacion de dependencias

Dentro de los directorios **./backend/** y **./frontend/**, se deben instalar las dependencias con el comando:

```
npm install
```

## 3.3 Variables de entorno

Se debe crear un archivo de varibles de entorno **.env** en la raiz del directorio **./backend/**, se sugiere la siguiente estructura:

```
DB_URL=postgresql://<user>:<password>@<server>:<port>/<database-name>

JWT_SECRET=test

URL_BASE=http://localhost:3000
```
También crear un archivo de varibles de entorno **.env** en la raiz del directorio **./frontend/**, se sugiere la siguiente estructura:
```
VITE_API_URL=http://localhost:3000
```

## 3.4 Ejecución (servidores)

### Para levantar el Backend

Dentro del directorio ./backend/ ejecutar el comando:

```
npm run dev
```

### Para levantar el Frontend

Dentro del directorio ./frontend/ ejecutar el comando:

```
npm run dev
```

El servidor web de acceso usuarios se está levantando en el puerto **5173**

```
http://localhost:5173/
```

## 3.5 Login Usuarios de prueba (3)

### Cliente:

```
Usuario: test1@test.com
Clave: 123456
```

### Empleado:

```
Usuario: test2@test.com
Clave: 123456
```

### Administrador/dueño

```
- usuario: admin@verduleria.cl
- Clave: admin1
```

## 3.6 Testing con Jest/supertest

### Para realizar los test:

```
npm run test:coverage
```

# 4. Documentacion API

## 4.1 Swagger

### Proxy (Frontend)

```
http://localhost:5173/api-docs/
```

### Server (Backend)

```
http://localhost:3000/api-docs/
```

# 5. Tech Stack

Node.js, React.js, Javascript, Jest, Babel

# 6. Dependencias

## 6.1 Dependencias del Backend

| Paquete            | Versión | Descripción Breve                                      |
| ------------------ | ------- | ------------------------------------------------------ |
| bcryptjs           | ^3.0.2  | Encriptación de contraseñas (hashing)                  |
| cors               | ^2.8.5v | Middleware para habilitar CORS                         |
| dotenv             | ^16.5.0 | Cargas variables de entorno desde un archivo .env      |
| express            | ^5.1.0  | Framework de servidor web para Node.js                 |
| jsonwebtoken       | ^9.0.2  | Generación y verificación de tokens JWT                |
| multer             | ^2.0.1  | Middleware para manejo de archivos multipart/form-data |
| pg                 | ^8.16.2 | Cliente de PostgreSQL para Node.js                     |
| pg-format          | ^1.0.4  | Formatea consultas SQL para PostgreSQL                 |
| swagger-jsdoc      | ^6.2.8  | Generación de documentación Swagger desde JSDoc        |
| swagger-ui-express | ^5.0.1  | Servidor Swagger UI para Express                       |
| yamljs             | ^0.3.0  | Carga archivos YAML como objetos JavaScript            |

## 6.2 Dependencias de Desarrollo del Backend

| Paquete  | Versión | Descripción breve                                               |
| -------- | ------- | --------------------------------------------------------------- |
| standard | ^17.1.2 | Estilo de código JavaScript (linting) basado en reglas estándar |

## 6.3 Dependencias del Frontend

| Paquete                           | Versión  | Descripción breve                           |
| --------------------------------- | -------- | ------------------------------------------- |
| @fortawesome/fontawesome-svg-core | ^6.7.2   | Núcleo de Font Awesome para usar íconos SVG |
| @fortawesome/free-solid-svg-icons | ^6.7.2   | Íconos sólidos gratuitos de Font Awesome    |
| @fortawesome/react-fontawesome    | ^0.2.2   | Integración de Font Awesome con React       |
| axios                             | ^1.10.0  | Cliente HTTP basado en promesas             |
| bootstrap                         | ^5.3.7   | Framework CSS responsive                    |
| prop-types                        | ^15.8.1  | Validación de props en componentes React    |
| react                             | ^19.1.0  | Biblioteca de interfaces de usuario         |
| react-bootstrap                   | ^2.10.10 | Componentes Bootstrap adaptados para React  |
| react-dom                         | ^19.1.0  | Renderizado de componentes React en el DOM  |
| react-router-dom                  | ^7.6.2   | Enrutamiento para aplicaciones React        |
| sweetalert2                       | ^11.22.0 | Ventanas modales modernas y personalizables |
| sweetalert2-react-content         | ^5.1.0   | Integración de SweetAlert2 con React        |

## 6.4 Dependencias de Desarrollo del Frontend

| Paquete                     | Versión | Descripción breve                                  |
| --------------------------- | ------- | -------------------------------------------------- |
| @eslint/js                  | ^9.25.0 | Configuración de ESLint en módulos JS              |
| @types/react                | ^19.1.2 | Tipos TypeScript para React                        |
| @types/react-dom            | ^19.1.2 | Tipos TypeScript para React DOM                    |
| @vitejs/plugin-react        | ^4.6.0  | Plugin de Vite para soportar React                 |
| eslint                      | ^9.25.0 | Linter para JavaScript y JSX                       |
| eslint-plugin-react-hooks   | ^5.2.0  | Reglas de ESLint para los hooks de React           |
| eslint-plugin-react-refresh | ^0.4.19 | Recarga en caliente (HMR) para React con Vite      |
| globals                     | ^16.0.0 | Lista de variables globales conocidas para linters |
| vite                        | ^6.3.5  | Empaquetador y servidor de desarrollo ultrarrápido |
