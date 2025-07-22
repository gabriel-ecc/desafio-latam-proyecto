import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  getInventory
} from '../src/controllers/productsController.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'

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

router.get('/products', verduleriaLog, getProducts)
router.get('/products/:id', verduleriaLog, getProduct)
router.post(
  '/products',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  createProduct
)
router.put(
  '/products/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  updateProduct
)

router.get(
  '/products/inventory',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getInventory
)

export default router
