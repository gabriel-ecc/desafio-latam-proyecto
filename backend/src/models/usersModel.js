import pool from '../../db/schema/config.js'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export const createUserModel = async (
  first_name,
  last_name,
  email,
  phone,
  password,
  user_type,
  status
) => {
  const userId = randomUUID()
  const hashedPassword = bcrypt.hashSync(password)
  const sqlQuery = {
    text: 'INSERT INTO users (id, first_name, last_name, email, phone, password, user_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, email, user_type',
    values: [
      userId,
      first_name,
      last_name,
      email,
      phone,
      hashedPassword,
      user_type,
      status
    ]
  }

  const response = await pool.query(sqlQuery)
  return response.rows
}

// Login
export const findUserByEmailModel = async (email) => {
  const sqlQuery = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
