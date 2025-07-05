import {
  createUserModel,
  getUsersPaginated,
  getCountUsers,
  findUserByIdModel,
  changeUserStatus
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
