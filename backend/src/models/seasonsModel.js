import pool from '../../config.js'

export const getSeasonsModel = async () => {
  const sqlQuery = { text: 'SELECT * FROM seasonal_category' }
  const response = await pool.query(sqlQuery)
  return response.rows
}
