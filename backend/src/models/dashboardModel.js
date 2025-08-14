import pool from '../../db/schema/config.js'

export const getDailySales = async () => {
  try {
    const sqlQuery = `
      SELECT
        COUNT(id) AS total_sales_count,
        SUM(total_amount) AS total_daily_revenue
      FROM
        orders
      WHERE
        DATE_TRUNC('day', create_date) = DATE_TRUNC('day', NOW());
    `
    const response = await pool.query(sqlQuery)
    return response.rows[0]
  } catch (error) {
    console.error('Error fetching daily sales:', error)
    throw error
  }
}

export const getDailyNewClients = async () => {
  try {
    const sqlQuery = `
      SELECT 
        DATE_TRUNC('day', create_date)
    `
  } catch (error) {
    
  }
}