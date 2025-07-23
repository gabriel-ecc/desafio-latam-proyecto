import { Router } from 'express'
import { loginUser } from '../src/controllers/authController.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'
const router = Router()

// Realiza login y genera token
router.post('/login', verduleriaLog, loginUser)

export default router
