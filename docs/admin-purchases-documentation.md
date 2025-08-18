# AdminPurchases - Gestión de Pedidos para Empleados y Administradores

## 📋 Descripción

La página `AdminPurchases` permite a empleados y administradores ver y gestionar todos los pedidos de los clientes, incluyendo la capacidad de actualizar el estado de los pedidos.

## 🎯 Funcionalidades

### 1. **Visualización de Pedidos**
- Ver todos los pedidos de todos los clientes
- Información completa del cliente (nombre y email)
- Estado actual del pedido
- Fecha de creación
- Monto total

### 2. **Detalles del Pedido**
- Información completa del cliente
- Productos incluidos en el pedido
- Precios y cantidades
- Tipo de entrega (pickup/delivery)
- Dirección de envío (si aplica)
- Nombre del destinatario (si aplica)

### 3. **Gestión de Estados**
- Cambiar estado de pedidos según el flujo del negocio
- Estados disponibles:
  - **Carrito (1)**: Pedido en estado inicial
  - **Retiro en Tienda (2)**: Cliente debe recoger en la tienda
  - **En Delivery (3)**: Pedido en proceso de entrega
  - **Finalizada (4)**: Pedido completado
  - **Cancelada (5)**: Pedido cancelado

### 4. **Reglas de Negocio**
- Solo empleados y administradores pueden acceder
- Los pedidos finalizados o cancelados no se pueden modificar
- Al cambiar a estado 2 o 3, se actualiza automáticamente el stock de productos
- Interfaz responsiva para móviles y tablets

## 🔧 Implementación Técnica

### Backend - Nuevos Endpoints

#### 1. `GET /api/v1/orders/all`
- **Descripción**: Obtiene todas las compras de todos los clientes
- **Permisos**: Empleados y Administradores
- **Respuesta**: Array de órdenes con información del cliente

#### 2. `GET /api/v1/orders/all/detail/:id`
- **Descripción**: Obtiene detalles completos de cualquier pedido
- **Permisos**: Empleados y Administradores
- **Parámetros**: `id` - ID del pedido
- **Respuesta**: Objeto con detalles del pedido y productos

#### 3. `PUT /api/v1/orders/:id/status`
- **Descripción**: Actualiza el estado de un pedido
- **Permisos**: Empleados y Administradores
- **Parámetros**: `id` - ID del pedido
- **Body**: `{ "order_status": number }`
- **Respuesta**: Confirmación de actualización

### Base de Datos - Nuevos Permisos

Se agregaron los siguientes permisos a la tabla `security_actions`:

```sql
-- Nuevas acciones de seguridad
INSERT INTO security_actions (security_route, security_method, description) VALUES 
('/orders/all', 'get', 'Ver todas las compras (admin)'),
('/orders/all/detail/:id', 'get', 'Ver detalle de cualquier compra (admin)'),
('/orders/:id/status', 'put', 'Actualizar estado de pedido (admin)');

-- Permisos para empleados y administradores
INSERT INTO security_actions_roles (security_action_id, user_type_id) VALUES 
(26, 2), (26, 3), -- Ver todas las compras
(27, 2), (27, 3), -- Ver detalles
(28, 2), (28, 3); -- Actualizar estado
```

### Frontend - Componente AdminPurchases

#### Estructura del Componente
- **Base**: Basado en `MyPurchases.jsx` con modificaciones para admin
- **Estados**: Gestión de pedidos, pedido seleccionado y estado de actualización
- **Funcionalidades**: Visualización, selección y actualización de pedidos

#### Estilos CSS
- Hereda estilos de `MyPurchases.css`
- Nuevos estilos específicos para:
  - Información del cliente
  - Botones de actualización de estado
  - Sección de gestión de estados
  - Responsive design

## 🚀 Uso

### 1. **Acceso**
- Iniciar sesión como empleado o administrador
- Navegar a la página "Gestión de Pedidos"

### 2. **Visualizar Pedidos**
- La lista muestra todos los pedidos ordenados por fecha (más recientes primero)
- Click en cualquier pedido para ver detalles

### 3. **Cambiar Estado**
- Seleccionar un pedido
- En la sección "Cambiar Estado del Pedido"
- Click en el botón del nuevo estado deseado
- Confirmar la actualización

### 4. **Flujo Recomendado**
1. **Carrito** → **Retiro en Tienda** o **En Delivery**
2. **Retiro en Tienda** → **Finalizada** (cuando el cliente recoge)
3. **En Delivery** → **Finalizada** (cuando se entrega)
4. Cualquier estado → **Cancelada** (si es necesario)

## ⚠️ Consideraciones

### Seguridad
- Todos los endpoints requieren autenticación con JWT
- Solo empleados y administradores tienen acceso
- Validación de permisos en cada request

### Performance
- Las consultas incluyen joins optimizados
- Paginación puede agregarse en el futuro si el volumen de pedidos crece
- Caché de datos puede implementarse según necesidad

### Mantenimiento
- Los estados están hardcodeados pero pueden moverse a base de datos
- Logs de cambios de estado pueden agregarse para auditoría
- Notificaciones a clientes pueden implementarse

## 🔄 Flujo de Estados

```
Carrito (1)
    ↓
Retiro en Tienda (2) ←→ En Delivery (3)
    ↓                        ↓
Finalizada (4)           Finalizada (4)
    
Cualquier estado → Cancelada (5)
```

## 📝 Notas de Desarrollo

- **Compatibilidad**: Compatible con la estructura existente del proyecto
- **Escalabilidad**: Diseñado para manejar crecimiento futuro
- **Mantenibilidad**: Código modular y bien documentado
- **Testing**: Endpoints probados y funcionales

---

*Desarrollado para el proyecto Desafío Latam - Verdulería Online*
