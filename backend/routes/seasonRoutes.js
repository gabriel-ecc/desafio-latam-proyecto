import { Router } from 'express'
import { getSeasons } from '../src/controllers/seasonController.js'

const router = Router()

// obtiene las temporadas de los productos
router.get('/seasons', getSeasons)

export default router
