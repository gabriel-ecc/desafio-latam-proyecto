import { Router } from 'express'
import { loginUser, getUserData } from '../src/controllers/authController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'

const router = Router()

// Verifica que exista el token y envía de datos del usuario (nombre, apellido, email, id y rol )
router.get('/usuarios', verifyToken, getUserData)

//
router.post('/login', loginUser)

export default router
