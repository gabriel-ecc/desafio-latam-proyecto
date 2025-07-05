import { findUserByEmailModel } from '../src/models/usersModel.js'

const createUserMiddleware = async (req, res, next) => {
  try {
    // Asegurarse de que Multer ya ha procesado req.body para los campos de texto
    const { firstName, lastName, email, phone, password, userType, userStatus } = req.body
    // el archivo subido estará en req.file, si se subió uno
    const profilePhotoFile = req.file // Ahora profilePhoto es el objeto de archivo de Multer

    // const { firstName, lastName, email, phone, password, userType, userStatus, profilePhoto } = req.body
    // validar que todos los campos estén presentes
    if (!firstName || !lastName || !email || !phone || !password || !userType || !userStatus) {
      console.log(firstName, lastName, email, phone, password, userType, userStatus, profilePhotoFile)
      return res.status(400).json({ message: 'Todos los campos (nombre, apellido, email, teléfono, password, usertype, userStatus y profilePhoto) son obligatorios' })
    }

    // Validar formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido.' })
    }

    // Validar longitud mínima del password
    if (password.length < 6) {
      return res.status(400).json({ message: 'El password debe tener al menos 6 caracteres.' })
    }

    // Verificar si el usuario ya existe
    const existingUser = await findUserByEmailModel(email)
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario con este correo electrónico ya existe.' })
    }

    next()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Hubo un problema al procesar la solicitud.' })
  }
}

export { createUserMiddleware }
