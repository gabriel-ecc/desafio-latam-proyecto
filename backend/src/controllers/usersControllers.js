import {
  createUserModel,
  getUsersPaginated,
  getCountUsers,
  findUserByIdModel,
  changeUserStatus,
  findUserByEmailModel
} from '../models/usersModel.js'

import { UserHATEOAS } from '../helpers/userHateoas.js'

export const registerUser = async (req, res) => {
  try {
    const userData = req.body
    // req.file contiene la informacion del archivo subido por Multer
    const profilePhotoFile = req.file

    let profilePhotoPath = ''
    if (profilePhotoFile) {
      // Si se subió el archivo, usa la ruta donde Multer lo guardó
      profilePhotoPath = profilePhotoFile.path
    } else {
      // Opcional: Si profile_photo no es obligatorio, le asignamos una cadena vacia
      profilePhotoPath = ''
    }

    // agregamos la ruta de la imagen a userData para pasarla al modelo
    userData.profilePhoto = profilePhotoPath

    const user = await createUserModel(userData)
    res
      .status(201)
      .json({ message: 'Usuario creado correctamente', user: user[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor al crear el usuario.' })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await getUsersPaginated(req.query)
    const count = await getCountUsers()
    const usersWithHATEOAS = await UserHATEOAS('user', users, count)
    res.status(200).json(usersWithHATEOAS)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const lockUser = async (req, res) => {
  try {
    const { id } = req.body
    const users = await findUserByIdModel(id)
    const user = await changeUserStatus(id, users.user_status)
    const outMessage = users.user_status === 1 ? 'Usuario bloqueado exitosamente' : 'Usuario desbloqueado exitosamente'
    res.status(200).json({ message: outMessage, user })
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const userEmail = req.user // El emal viene desde el middleware de verifyToken
    console.log('User profile request for email: ', userEmail)

    const user = await findUserByEmailModel(userEmail)

    if (!user) {
      console.log('Usuario no encontrado', userEmail)
      return res.status(404).json({ message: 'Perfil no encontrado' })
    }

    // Preparamos los datos a utilizar (sin datos sensibles)
    const userProfileData = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      userType: user.user_type,
      userStatus: user.user_status,
      profilePhoto: user.profile_photo
    }

    res.status(200).json(userProfileData)
  } catch (error) {
    console.error('Error en getUserProfile', error)
    console.error(500).json({ message: 'Error al obtener el perfil del usuario' })
  }
}
