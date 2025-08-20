# Página "Mis Compras" - Frontend

## Descripción

Esta página permite a los clientes ver el historial de sus compras con tres estados posibles: "Entregado", "En camino" y "Listo para retiro".

## Estructura Visual

- **Lado izquierdo**: Lista de compras con detalles resumidos de cada pedido
- **Lado derecho**: Detalles completos del pedido seleccionado, incluyendo productos y precio final

## Características Implementadas

### Estados de Compra

- **Entregado** (✓): Pedido completado - badge verde
- **En camino** (🚚): Pedido en tránsito - badge amarillo
- **Listo para retiro** (📦): Pedido listo en tienda - badge azul

### Funcionalidades Frontend

1. **Lista interactiva** de pedidos en el lado izquierdo
2. **Selección** de pedidos para ver detalles
3. **Vista detallada** de productos en cada pedido
4. **Cálculo automático** de subtotales y totales
5. **Diseño responsive** que se adapta a móviles y desktop
6. **Protección de ruta** - solo usuarios logueados pueden acceder

### Componentes Utilizados

- `BackButton`: Botón para regresar
- Estilos consistentes con la página Cart
- Mock data para demostrar funcionalidad

## Próximos Pasos para el Backend

### Endpoints Necesarios

```javascript
// Obtener compras del usuario logueado
GET /api/purchases/user/:userId
Response: [
  {
    id: number,
    orderNumber: string,
    date: string,
    status: 'Entregado' | 'En camino' | 'Listo para retiro',
    total: number,
    estimatedDate: string,
    products: [
      {
        id: number,
        name: string,
        price: number,
        quantity: number,
        img: string
      }
    ]
  }
]
```

### Integración Pendiente

1. **Reemplazar mock data** con llamadas al API
2. **Manejo de estados de carga** y errores
3. **Paginación** para usuarios con muchas compras
4. **Filtros** por estado o fecha (opcional)
5. **Actualización en tiempo real** del estado de los pedidos

### Archivos Creados/Modificados

- `/frontend/src/pages/MyPurchases.jsx` - Componente principal
- `/frontend/src/pages/MyPurchases.css` - Estilos de la página
- `/frontend/src/App.jsx` - Ruta protegida agregada

### Ruta Accesible

- URL: `/mis-compras`
- Protección: Usuarios tipo 1, 2, 3 (todos los usuarios logueados)
- Redirección si no logueado: `/login`

## Mock Data Incluido

La página incluye datos de ejemplo con 3 pedidos que muestran diferentes estados y productos para demonstrar la funcionalidad completa.
