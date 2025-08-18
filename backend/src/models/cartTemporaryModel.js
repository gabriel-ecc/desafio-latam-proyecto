import pool from '../../db/schema/config.js'

// Obtener el carrito viejo o crear uno nuevo
const getOrCreateTemporaryCart = async (userId) => {
  const oldCartSql = {
    text: 'SELECT * FROM orders WHERE user_id = $1 AND order_status = 1',
    values: [userId]
  }
  const oldCart = await pool.query(oldCartSql)
  if (oldCart.rows.length > 0) {
    return oldCart.rows[0]
  }
  const sqlQuery = {
    text: 'INSERT INTO orders (user_id, order_status, delivery_type, total_amount) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [userId, 1, 1, 0]
  }
  const insert = await pool.query(sqlQuery)
  return insert.rows[0]
}

// Actualizar los Items del carrito
const updateItemCart = async (order_id, productId, quantity, unitPrice) => {
  const checkItemQuery = {
    text: 'SELECT * FROM order_items WHERE order_id = $1 AND product_id = $2',
    values: [order_id, productId]
  }
  const res = await pool.query(checkItemQuery)

  if (res.rows.length > 0) {
    const updateItemQuery = {
      text: 'UPDATE order_items SET quantity = $1, unit_price = $2 WHERE order_id = $3 AND product_id = $4',
      values: [quantity, unitPrice, order_id, productId]
    }
    await pool.query(updateItemQuery)
  } else {
    const insertItemQuery = {
      text: 'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
      values: [order_id, productId, quantity, unitPrice]
    }
    await pool.query(insertItemQuery)
  }
  // Actualizar el total del carrito
  const totalCartQuery = {
    text: 'SELECT SUM(quantity * unit_price) AS total FROM order_items WHERE order_id = $1',
    values: [order_id]
  }
  const totalRes = await pool.query(totalCartQuery)

  const updateTotalQuery = {
    text: 'UPDATE orders SET total_amount = $1 WHERE id = $2',
    values: [totalRes.rows[0].total, order_id]
  }
  await pool.query(updateTotalQuery)
}

export { getOrCreateTemporaryCart, updateItemCart }
