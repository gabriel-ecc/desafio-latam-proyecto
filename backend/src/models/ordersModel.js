import pool from '../../db/schema/config.js'
import format from 'pg-format'

export const getMyPurchasesSQL = async userId => {
  const sqlQuery = {
    text: 'select * from orders where user_id = %L',
    values: [userId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}

export const getMyPurchasesDetailSQL = async (userId, orderId) => {
  const sqlQuery = {
    text: 'select * from orders as a inner join order_items as b on a.id = b.order_id where user_id = %L and id = %L',
    values: [userId, orderId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}
