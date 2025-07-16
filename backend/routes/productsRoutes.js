import { Router } from 'express'
import { getProduct,getProducts } from '../src/controllers/productsController.js'

const router = Router()

router.get('/products',getProducts)
router.get('/products/:id',getProduct)

export default router
