import { Router } from 'express'
import { getCategories } from '../src/controllers/categoriesController.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'
const router = Router()

// obtiene las categorías de los productos
router.get('/categories', getCategories)
router.get('/categories', verduleriaLog, getCategories)

export default router
