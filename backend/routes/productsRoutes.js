import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct
} from '../src/controllers/productsController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'

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

router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.post(
  '/products',
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  createProduct
)
router.put(
  '/products/:id',
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  updateProduct
)

export default router
