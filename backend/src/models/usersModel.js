import pool from "../../db/schema/config.js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export const createUserModel = async (
  fistName,
  lastName,
  email,
  phone,
  password,
  userType
) => {
  const userId = randomUUID();
  const hashedPassword = bcrypt.hashSync(password);
  const sqlQuery = {
    text: "INSERT INTO usuarios (id, first_name, last_name, email,phone, password, user_type) VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING first_name, last_name, email, user_type",
    values: [
      userId,
      fistName,
      lastName,
      email,
      phone,
      hashedPassword,
      userType,
    ],
  };

  const response = await pool.query(sqlQuery);
  return response.rows;
};

// Login
export const findUserByEmailModel = async (email) => {
  const sqlQuery = {
    text: "SELECT * FROM usuarios WHERE email = $1",
    values: [email],
  };

  const response = await pool.query(sqlQuery);
  return response.rows[0];
};
