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

export const getTopSellingProductsDaily = async () => {
  try {
    const sqlQuery = `
      SELECT
        p.name AS product_name,
        SUM(oi.quantity) AS total_sold
      FROM
        order_items oi
      INNER JOIN
        orders o ON oi.order_id = o.id
      INNER JOIN
        products p ON oi.product_id = p.id
      WHERE
        DATE_TRUNC('day', o.create_date) <= DATE_TRUNC('day', NOW())
      GROUP BY
        p.name
      ORDER BY
        total_sold DESC
      LIMIT 10;
    `
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error obteniendo los productos mas vendidos diariamente:', error)
    throw error
  }
}

export const getLowStockProducts = async () => {
  try {
    const sqlQuery = `
      SELECT
        id,
        name AS product_name,
        stock
      FROM
        products
      WHERE
        status = true AND stock > 0
      ORDER BY
        stock ASC
      LIMIT 5;
    `
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error obteniendo los productos con bajo stock:', error)
    throw error
  }
}

export const getInactiveClients = async () => {
  try {
    const sqlQuery = `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        MAX(o.create_date) AS last_purchase_date
      FROM
        users u
      LEFT JOIN
        orders o ON u.id = o.user_id
      WHERE
        u.user_type = 2
      GROUP BY
        u.id, u.first_name, u.last_name, u.email
      HAVING
        MAX(o.create_date) < NOW() - INTERVAL '30 days' OR MAX(o.create_date) IS NULL
      ORDER BY
        last_purchase_date ASC;
    `
    const response = await pool.query(sqlQuery)
    return response.rows
  } catch (error) {
    console.error('Error obteniendo los clientes sin compras:', error)
    throw error
  }
}
