import express from 'express'
import postCartOrder from '../src/controllers/ordersController.js'

const router = express.Router()

// Guardar carrito temporal
router.post('/', postCartOrder)

export default router
