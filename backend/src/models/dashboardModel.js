import pool from '../../db/schema/config.js'
// import format from 'pg-format'

export const getDailySalesWeekly = async () => {
  try {
    const sqlQuery = `
      SELECT
        DATE_TRUNC('day', create_date) AS date,
        SUM(total_amount) AS total_revenue
      FROM
        orders
      WHERE
        create_date >= NOW() - INTERVAL '7 days'
      GROUP BY
        date
      ORDER BY
        date ASC;
    `
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error obteniendo las ventas diarias para la semana:', error)
    throw error
  }
}

export const getNewClientsWeekly = async () => {
  try {
    const sqlQuery = `
      SELECT
        DATE_TRUNC('day', create_date) AS date,
        COUNT(id) AS new_clients
      FROM
        users
      WHERE
        create_date >= NOW() - INTERVAL '7 days'
      GROUP BY
        date
      ORDER BY
        date ASC;
    `
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error obteniendo los nuevos clientes de la semana:', error)
    throw error
  }
}
