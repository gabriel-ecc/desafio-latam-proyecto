import { Router } from 'express'
import { getCategories } from '../src/controllers/categoriesController.js'

const router = Router()

// obtiene las categorías de los productos
router.get('/categories', getCategories)

export default router
