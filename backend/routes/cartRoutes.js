import express from 'express'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import {
  getTemporaryCart,
  putItem
} from '../src/controllers/cartTemporaryController.js'

const router = express.Router()

// Guardar carrito temporal
router.get('/cart', verifyToken, getTemporaryCart)
router.put('/cart', verifyToken, putItem)

export default router
