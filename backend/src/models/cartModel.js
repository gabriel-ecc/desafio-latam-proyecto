import pool from '../../db/schema/config.js'

// Creamos la orden

const createOrderCartModel = async ({ userId, orderStatus, deliveryType, shippingAddress, recipientName, totalAmount }) => {
  const sqlQuery = {
    text: 'INSERT INTO orders (user_id, order_status, delivery_type, shipping_address, recipient_name, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    values: [userId, orderStatus, deliveryType, shippingAddress, recipientName, totalAmount]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
const addOrderItemModel = async (orderId, productId, quantity, unitPrice) => {
  const sqlQuery = {
    text: 'INSERT INTO order_items (order_id, product_id, quantity, unit_prince) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [orderId, productId, quantity, unitPrice]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export default { createOrderCartModel, addOrderItemModel }
