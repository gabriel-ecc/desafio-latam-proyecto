import { Router } from 'express'
import { getSeasons } from '../src/controllers/seasonController.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'
const router = Router()

router.get('/seasons', verduleriaLog, getSeasons)

export default router
