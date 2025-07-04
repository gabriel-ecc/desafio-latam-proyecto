import { createUserModel } from "../models/usersModel.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const user = await createUserModel(
      firstName,
      lastName,
      email,
      phone,
      password,
      1
    );
    res.status(201).json({ message: "Usuario creado correctamente", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
