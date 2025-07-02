import { Router } from 'express'
import { loginUser, getUserData } from '../src/controllers/authController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'

const router = Router()

router.get('/usuarios', verifyToken, getUserData)
router.post('/login', loginUser)

export default router
