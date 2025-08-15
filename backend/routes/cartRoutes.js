import express from 'express'
import { getTemporaryCart, putItem } from '../src/controllers/cartTemporaryController.js'

const router = express.Router()

// Guardar carrito temporal
router.get('/', getTemporaryCart)
router.put('/', putItem)

export default router
