import express, { Router } from 'express'
import postCartOrder from '../controllers/cartController.js'

const router = express.Router()

// Guardar carrito temporal
router.post('/', postCartOrder)

export default router
