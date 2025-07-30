import { findUserByEmailModel } from '../models/usersModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Valida el usuario (trae el email y contraseña) y genera el token
const loginUser = async (req, res) => {
  const errorMessage = 'Email o Contraseña incorrecta'
  try {
    const { email, password } = req.body
    const user = await findUserByEmailModel(email)

    if (!user) {
      return res.status(401).json({ message: errorMessage })
    }

    const status = user.user_status
    if (status === 0) {
      return res.status(403).json({
        message: 'Usuario bloqueado'
      })
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: errorMessage })
    }
    const userId = user.id

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ message: errorMessage })
    console.error(error)
  }
}

export { loginUser }
