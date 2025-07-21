import jwt from 'jsonwebtoken'
import 'dotenv/config'

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')

    if (!token) {
      return res.status(400).json({ message: 'El token debe estar presente' })
    }
    const extractToken = token.split(' ')[1] // de los 2 documentos del arreglo, tomamos el segundo
    const decodedToken = jwt.verify(extractToken, process.env.JWT_SECRET)
    req.user = decodedToken.userId
    next()
  } catch (error) {
    console.error('Error en verifyTokenMiddleware', error)
    return res.status(400).json({ message: 'El token es invalido' })
  }
}

export { verifyToken }
