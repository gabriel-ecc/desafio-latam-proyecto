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
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import { verduleriaLog } from '../middleware/logMiddleware.js'
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
// Crear usuario
router.post(
  '/users',
  verduleriaLog,
  upload.single('profilePhoto'),
  createUserMiddleware,
  registerClientUser
)
// Obtener lista de usuarios
router.get(
  '/users',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getUsers
)
// Bloquear usuario
router.put(
  '/users/lockuser',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  lockUser
)
// Obtener datos de perfil
router.get(
  '/users/profile',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getUserProfile
)
// Actualizar perfil
router.put(
  '/users/profile',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  upload.single('profilePhoto'),
  updateUserProfile
)

export default router
