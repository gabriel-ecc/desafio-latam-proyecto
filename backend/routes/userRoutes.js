// userRoutes.js
import { Router } from 'express'
import multer from 'multer'
import path from 'path'

import {
  registerClientUser,
  getUsers,
  lockUser,
  getUserProfile,
  updateUserProfile
} from '../src/controllers/usersControllers.js'
import { createUserMiddleware } from '../middleware/userMiddleware.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'

const router = Router()

// --- Configuración de Multer ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(process.cwd(), 'uploads')
    console.log('Multer: Intentando guardar archivo en:', uploadPath)
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const newFileName =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    console.log('Multer: Generando nombre de archivo:', newFileName)
    console.log('Multer: Objeto "file" recibido por Multer:', file)
    cb(null, newFileName)
  }
})

// --- Creamos la instancia de Multer con la configuracion de almacenamiento ---
const upload = multer({ storage }) // usamos propiedad 'Property Shorthand'

// Rutas
// --- Aplicamos el middleware de Multer ANTES de createUserMiddleware ---
router.post(
  '/users',
  (req, res, next) => {
    // Añadimos un middleware de depuración justo antes de Multer
    console.log(
      'DEBUG: Solicitud entrante a /users. req.body ANTES de Multer:',
      req.body
    )
    console.log(
      'DEBUG: Solicitud entrante a /users. req.file ANTES de Multer:',
      req.file
    )
    next()
  },
  upload.single('profilePhoto'),
  (req, res, next) => {
    // Añadimos un middleware de depuración justo DESPUÉS de Multer
    console.log(
      'DEBUG: Solicitud pasó por Multer. req.body DESPUÉS de Multer:',
      req.body
    )
    console.log(
      'DEBUG: Solicitud pasó por Multer. req.file DESPUÉS de Multer (¡ESTO DEBE TENER UN VALOR!):',
      req.file
    )
    next()
  },
  createUserMiddleware,
  registerClientUser
)

router.get('/users', getUsers) // listar usuarios
router.put('/users/lockuser', lockUser)
router.get('/users/profile', verifyToken, getUserProfile)

router.put(
  '/users/profile',
  verifyToken,
  upload.single('profilePhoto'),
  updateUserProfile
)

export default router
