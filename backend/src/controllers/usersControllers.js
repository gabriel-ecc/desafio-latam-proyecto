import {
  createUserModel,
  getUsersPaginated,
  getCountUsers,
  findUserByIdModel,
  changeUserStatus,
  findUserByEmailModel,
  updateUserProfileModel
} from '../models/usersModel.js'

import { UserHATEOAS } from '../helpers/userHateoas.js'

export const registerClientUser = async (req, res) => {
  try {
    const userData = req.body
    userData.userType = 1
    // req.file contiene la informacion del archivo subido por Multer
    const profilePhotoFile = req.file

    let profilePhotoPath = ''
    if (profilePhotoFile) {
      // Si se subió el archivo, usa la ruta donde Multer lo guardó
      profilePhotoPath = profilePhotoFile.path
    }

    // agregamos la ruta de la imagen a userData para pasarla al modelo
    userData.profilePhoto = profilePhotoPath

    const user = await createUserModel(userData)
    res
      .status(201)
      .json({ message: 'Usuario creado correctamente', user: user[0] })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error interno del servidor al crear el usuario.' })
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
    const outMessage =
      users.user_status === 1
        ? 'Usuario bloqueado exitosamente'
        : 'Usuario desbloqueado exitosamente'
    res.status(200).json({ message: outMessage, user })
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const getUserProfile = async (req, res) => {
  try {
    const userData = req.user // El emal viene desde el middleware de verifyToken
    console.log('User profile request for email: ', userData)

    const user = await findUserByIdModel(userData)

    if (!user) {
      console.log('Usuario no encontrado', userData)
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
    console
      .error(500)
      .json({ message: 'Error al obtener el perfil del usuario' })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    console.log(req.user)
    const userId = req.user // correo del usuario desde el verifyToken del middleware
    const { firstName, lastName, phone } = req.body
    const profilePhotoFile = req.file // viene de Multer

    let profilePhotoPath // lo actualizaremos solo si viene una imagen
    if (profilePhotoFile) {
      profilePhotoPath = `uploads/${profilePhotoFile.filename}`
    }

    const userDataToUpdate = {
      firstName,
      lastName,
      phone,
      profilePhoto: profilePhotoPath
    }

    // Filtramos para actualizar solo los valores modificados
    const filteredUserData = Object.fromEntries(
      Object.entries(userDataToUpdate).filter(
        ([_, value]) => value !== undefined
      )
    )

    // nos aseguramos de que hay, al menos, 1 campo, además del correo
    if (Object.keys(filteredUserData).length === 0) {
      return res.status(400).json({ message: 'No vienen datos' })
    }

    const updatedUser = await updateUserProfileModel(userId, filteredUserData)

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // preapramos los datos a actualizar
    const userProfileData = {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      userType: updatedUser.user_type,
      userStatus: updatedUser.user_status,
      profilePhoto: updatedUser.profile_photo
    }

    res
      .status(200)
      .json({ message: 'Perfil actualizado', user: userProfileData })
  } catch (error) {
    console.error('Error en updatedUserProfile: ', error)
    return res.status(500).json({ message: 'Error al actualizar' })
  }
}
