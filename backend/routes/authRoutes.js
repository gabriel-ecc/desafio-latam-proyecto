import { Router } from 'express'
import { loginUser } from '../src/controllers/authController.js'

const router = Router()

// Realiza login y genera token
router.post('/login', loginUser)

export default router
