import express from 'express'
import { verduleriaLog } from '../middleware/logMiddleware.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import {
  postCartOrder,
  getMyPurchases,
  getMyPurchasesDetail,
  getAllPurchases,
  getAllPurchasesDetail,
  updateOrderStatus
} from '../src/controllers/ordersController.js'

const router = express.Router()

// Guardar carrito temporal
router.post('/orders', verifyToken, postCartOrder)
router.get(
  '/orders/my',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getMyPurchases
)

router.get(
  '/orders/my/detail/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getMyPurchasesDetail
)

// Rutas para admin/empleado - obtener todas las compras
router.get(
  '/orders/all',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getAllPurchases
)

// Ruta para admin/empleado - obtener detalles de cualquier compra
router.get(
  '/orders/all/detail/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getAllPurchasesDetail
)

// Ruta para admin/empleado - actualizar estado de un pedido
router.put(
  '/orders/:id/status',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  updateOrderStatus
)

export default router
