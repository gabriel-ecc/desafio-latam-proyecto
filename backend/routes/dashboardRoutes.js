import { Router } from 'express'
import {
  getDailySalesWeeklyController,
  getNewClientsWeeklyController
} from '../src/controllers/dashboardController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'

const router = Router()

// Obtenemos la métrica de ventas diarias de la última semana
router.get(
  '/dashboard/daily-sales-weekly',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getDailySalesWeeklyController
)

// Obtener la métrica de nuevos clientes de la última semana
router.get(
  '/dashboard/new-clients-weekly',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getNewClientsWeeklyController
)

export default router
