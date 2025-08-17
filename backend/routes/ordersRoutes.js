import express from 'express'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import postCartOrder from '../src/controllers/ordersController.js'

const router = express.Router()

// Guardar carrito temporal
router.post('/orders', verifyToken, postCartOrder)

export default router
