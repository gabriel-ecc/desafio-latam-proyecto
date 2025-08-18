import express from 'express'
import { verduleriaLog } from '../middleware/logMiddleware.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import {
  postCartOrder,
  getMyPurchases,
  getMyPurchasesDetail
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

export default router
