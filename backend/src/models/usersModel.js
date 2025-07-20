import pool from '../../db/schema/config.js'
import format from 'pg-format'
import bcrypt from 'bcryptjs'

export const createUserModel = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  userType,
  userStatus = 1,
  profilePhoto = ''
}) => {
  const hashedPassword = bcrypt.hashSync(password)

  const sqlQuery = {
    text: 'INSERT INTO users (first_name, last_name, email, phone, password, user_type, user_status, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, email, phone, user_type, user_status, profile_photo ',
    values: [
      firstName,
      lastName,
      email,
      phone,
      hashedPassword,
      userType,
      userStatus,
      profilePhoto
    ]
  }

  const response = await pool.query(sqlQuery)
  return response.rows
}

// Login
export const findUserByEmailModel = async email => {
  const sqlQuery = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const findUserByIdModel = async id => {
  const sqlQuery = {
    text: 'SELECT * FROM users WHERE id = $1',
    values: [String(id)]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

// lista todos los usuarios
export const getUsersPaginated = async ({
  limits = 10,
  page = 1,
  orderBy = 'id_ASC'
}) => {
  const [columna, direccion] = orderBy.split('_')
  const offset = Math.abs((page - 1) * limits)
  const queryWithFormat = format(
    'SELECT first_name, last_name, email, user_type, user_status, profile_photo FROM users ORDER BY %I %s LIMIT %s OFFSET %s',
    columna,
    direccion,
    limits,
    offset
  )
  const { rows: userList } = await pool.query(queryWithFormat)
  return userList
}

export const getCountUsers = async () => {
  const sqlQuery = {
    text: 'SELECT count(1) as cantidad FROM users'
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const changeUserStatus = async (id, status) => {
  // status === 1 ? (status = 0) : (status = 1)
  status = status === 0 ? 1 : 0
  const sqlQuery = {
    text: 'UPDATE users SET user_status = $1 WHERE id = $2 RETURNING id,user_status',
    values: [status, id]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const updateUserProfileModel = async (email, userData) => {
  const { firstName, lastName, phone, profilePhoto } = userData
  const updates = []
  const values = []
  let paramIndex = 1

  if (firstName) {
    updates.push(`first_name = $${paramIndex++}`)
    values.push(firstName)
  }

  if (lastName) {
    updates.push(`last_name = $${paramIndex++}`)
    values.push(lastName)
  }

  if (phone) {
    updates.push(`phone = $${paramIndex++}`)
    values.push(phone)
  }

  if (profilePhoto) {
    updates.push(`profile_photo = $${paramIndex++}`)
    values.push(profilePhoto)
  }

  // agregamos el email al 'where'
  values.push(email)

  if (updates.length === 0) {
    return null // no hay campos por actualizar
  }

  const sqlQuery = {
    text: `UPDATE users SET ${updates.join(', ')} WHERE email = $${paramIndex} RETURNING id, first_name, last_name, email, phone, user_type, user_status, profile_photo`,
    values
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
