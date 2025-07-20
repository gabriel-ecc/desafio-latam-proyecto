import pool from '../../db/schema/config.js'

export const getCategoriesModel = async () => {
  const sqlQuery = { text: 'SELECT * FROM product_category' }
  const response = await pool.query(sqlQuery)
  return response.rows
}
