import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  getInventory,
  productListFrontPage,
  toggleProductStatus
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
// Obtener productos paginados
router.get('/products', verduleriaLog, getProducts)

// Obtener productos para frontpage
router.get('/products/frontPage', verduleriaLog, productListFrontPage)

// Obtener inventario de productos para empleados y admin
router.get(
  '/products/inventory',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getInventory
)

// Obtener producto por id
router.get('/products/:id', verduleriaLog, getProduct)
router.post(
  '/products',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  createProduct
)

// Actualizar producto
router.put(
  '/products/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  upload.single('productPhoto'),
  updateProduct
)

// Bloquear producto
router.put(
  '/products/lock/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  toggleProductStatus
)

export default router
