import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct
} from '../src/controllers/productsController.js'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads')
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const newFileName = file.originalname
    cb(null, newFileName)
  }
})

const router = Router()
const upload = multer({ storage })

router.get('/products', getProducts) // obtiene todos los Productos
router.get('/products/:id', getProduct) // obtiene 1 producto
router.post('/products', upload.single('productPhoto'), createProduct) // crear 1 producto
router.put('/products/:id', upload.single('productPhoto'), updateProduct) // actualizar un producto

export default router
