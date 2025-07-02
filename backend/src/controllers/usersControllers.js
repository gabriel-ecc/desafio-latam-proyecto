import { createUserModel } from '../models/usersModel.js'

export const registerUser = async (req, res) => {
  try {
    const { nameLastName, email, password, rol } = req.body
    const user = await createUserModel(nameLastName, email, password, rol)
    res.status(201).json({ message: 'Usuario creado correctamente', user })
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
