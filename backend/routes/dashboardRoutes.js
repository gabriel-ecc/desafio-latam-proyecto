import { Router } from 'express'
import { getDailySalesController } from '../src/controllers/dashboardController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'

const router = Router()

// Obtenemos las ventas del día
router.get(
  '/dashboard/daily-sales',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getDailySalesController
)

export default router
