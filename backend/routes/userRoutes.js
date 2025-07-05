import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import {
  registerUser,
  getUsers,
  lockUser
} from '../src/controllers/usersControllers.js'
import { createUserMiddleware } from '../middleware/userMiddleware.js'

const router = Router()

// configuramos Multer
const storage = multer.diskStorage({
  // donde guardaremos los archivos
  destination: function (req, file, cb) {
    // Asegurarse de que la carpeta exista
    cb(null, path.resolve(process.cwd(), '/uploads'))
  },

  // filename
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// Creamos la instancia de Multer con la configuracion de almacenamiento
const upload = multer({ storage: storage })

// Rutas
router.post('/users', upload.single('profilePhoto'), createUserMiddleware, registerUser)
router.get('/users', getUsers)
router.put('/lockuser', lockUser)

export default router
