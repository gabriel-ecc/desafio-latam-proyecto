import { findUserByEmailModel } from '../models/usersModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await findUserByEmailModel(email)
    const status = user.user_status

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrecta' })
    }
    if (status === 0) {
      return res.status(403).json({
        message: 'Usuario bloqueado'
      })
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'No autorizado' })
    }
    const userId = user.id

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ message: 'Error de token' })
    console.error(error)
  }
}

const getUserData = async (req, res) => {
  try {
    const email = req.user //
    console.log(
      'authController getUserData: Email recibido de req.user: ',
      email
    )
    const user = await findUserByEmailModel(email)

    if (!user) {
      console.log(
        'authController getUserData: Usuario NO encontrado en la bd para el email: ',
        email
      )
      return res.status(404).json({ message: 'Usuario NO encontrado en la bd' })
    }

    // Devolvemos solo los datos permitidos
    const userData = {
      nameLastName: user.nameLastName,
      email: user.email,
      rol: user.rol
    }
    res.status(200).json(userData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los datos del usuario.' })
  }
}

export { loginUser, getUserData }
