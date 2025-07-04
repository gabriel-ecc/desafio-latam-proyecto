import pool from "../../db/schema/config.js";
import format from "pg-format";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export const createUserModel = async (
  first_name,
  last_name,
  email,
  phone,
  password,
  user_type,
  status
) => {
  const userId = randomUUID();
  const hashedPassword = bcrypt.hashSync(password);
  const sqlQuery = {
    text: "INSERT INTO users (id, first_name, last_name, email, phone, password, user_type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, email, user_type",
    values: [
      userId,
      first_name,
      last_name,
      email,
      phone,
      hashedPassword,
      user_type,
      status,
    ],
  };

  const response = await pool.query(sqlQuery);
  return response.rows;
};

// Login
export const findUserByEmailModel = async (email) => {
  const sqlQuery = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  const response = await pool.query(sqlQuery);
  return response.rows[0];
};

export const findUserByIdModel = async (id) => {
  const sqlQuery = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [String(id)],
  };
  const response = await pool.query(sqlQuery);
  return response.rows[0];
};

//lista todos los usuarios
export const getUsersPaginated = async ({
  limits = 10,
  page = 1,
  order_by = "id_ASC",
}) => {
  const [columna, direccion] = order_by.split("_");
  const offset = Math.abs((page - 1) * limits);
  const queryWithFormat = format(
    "SELECT id, first_name, last_name, email,user_type,user_status FROM users ORDER BY %I %s LIMIT %s OFFSET %s",
    columna,
    direccion,
    limits,
    offset
  );
  const { rows: userList } = await pool.query(queryWithFormat);
  return userList;
};

export const getCountUsers = async () => {
  const sqlQuery = {
    text: "SELECT count(1) as cantidad FROM users",
  };
  const response = await pool.query(sqlQuery);
  return response.rows[0];
};

export const changeUserStatus = async (id, status) => {
  status === 1 ? (status = 0) : (status = 1);
  const sqlQuery = {
    text: "UPDATE users SET user_status = $1 WHERE id = $2 RETURNING id,user_status",
    values: [status, id],
  };
  const response = await pool.query(sqlQuery);
  return response.rows[0];
};
