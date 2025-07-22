import { getPermissions } from '../src/models/authorizationModel.js'
import { findUserByIdModel } from '../src/models/usersModel.js'

export const authorizationMiddleware = async (req, res, next) => {
  try {
    const securityRoute = req.route.path
    const securityMethod = req.method.toLowerCase()
    const userId = req.user
    const user = await findUserByIdModel(userId)
    const userType = user.user_type
    const status = user.user_status
    if (status === 0) {
      return res.status(403).json({
        message: 'Usuario bloqueado'
      })
    } else {
      const permission = await getPermissions(
        securityRoute,
        securityMethod,
        userType
      )
      if (permission) {
        next()
      } else {
        return res.status(403).json({
          message: 'Usuario no tiene permisos para realizar esta acción'
        })
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error en authorizationMiddleware' })
  }
}
