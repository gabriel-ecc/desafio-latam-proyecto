import { Router } from 'express'
import { registerUser } from '../src/controllers/usersControllers.js'
import { createUserMiddleware } from '../middleware/userMiddleware.js'

const router = Router()

router.post('/usuarios', createUserMiddleware, registerUser)

export default router
