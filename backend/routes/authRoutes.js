import { Router } from 'express'
import { loginUser, getUserData } from '../src/controllers/authController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'

const router = Router()

// Verifica token y envía nombre, email y rol del usuario
router.get('/usuarios', verifyToken, getUserData)

// Realiza login y genera token
router.post('/login', loginUser)

export default router
