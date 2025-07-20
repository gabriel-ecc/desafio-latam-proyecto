import pool from '../../db/schema/config.js'

export const getSeasonsModel = async () => {
  const sqlQuery = { text: 'SELECT * FROM season_category' }
  const response = await pool.query(sqlQuery)
  return response.rows
}
