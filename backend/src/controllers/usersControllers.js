import { createUserModel } from "../models/usersModel.js";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body
    const user = await createUserModel(
      first_name,
      last_name,
      email,
      phone,
      password,
      1, // user_type: 1 = cliente
      1 // status: 1 = activo
    )
    res
      .status(201)
      .json({ message: 'Usuario creado correctamente', user: user[0] })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor al crear el usuario.' })
  }
}
