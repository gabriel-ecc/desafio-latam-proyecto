import pool from '../../db/schema/config.js'
import bcrypt from 'bcryptjs'

export const createUserModel = async (nameLastName, email, password, rol) => {
  const hashedPassword = bcrypt.hashSync(password)
  const sqlQuery = {
    text: 'INSERT INTO usuarios (nameLastName, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING nameLastName, email, rol',
    values: [nameLastName, email, hashedPassword, rol]
  }

  const response = await pool.query(sqlQuery)
  return response.rows
}

// Login
export const findUserByEmailModel = async (email) => {
  const sqlQuery = {
    text: 'SELECT * FROM usuarios WHERE email = $1',
    values: [email]
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
