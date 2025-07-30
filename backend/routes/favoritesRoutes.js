import { Router } from 'express'
import { verduleriaLog } from '../middleware/logMiddleware.js'
import { verifyToken } from '../middleware/verifyTokenMiddleware.js'
import { authorizationMiddleware } from '../middleware/authorizationMiddleware.js'
import {
  actionFavorite,
  getFavoritesPaginated,
  getFavorite
} from '../src/controllers/favoritesController.js'

const router = Router()

// Agregar o quitar favorito
router.put(
  '/favorites',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  actionFavorite
)

// Obtener marca favorito para cliente
// id del producto
router.get(
  '/favorites/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getFavorite
)

// Obtener mis favoritos
// id del cliente
router.get(
  '/favorites/my/:id',
  verduleriaLog,
  verifyToken,
  authorizationMiddleware,
  getFavoritesPaginated
)

export default router
