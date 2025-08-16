import pool from '../../db/schema/config.js'

// Creamos la orden

export const createOrderCartModel = async ({
  userId,
  orderStatus,
  deliveryType,
  shippingAddress,
  recipientName,
  totalAmount
}) => {
  const sqlQuery = {
    text: 'INSERT INTO orders (user_id, order_status, delivery_type, shipping_address, recipient_name, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    values: [
      userId,
      orderStatus,
      deliveryType,
      shippingAddress,
      recipientName,
      totalAmount
    ]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
export const addOrderItemModel = async (
  orderId,
  productId,
  quantity,
  unitPrice
) => {
  const sqlQuery = {
    text: 'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING *',
    values: [orderId, productId, quantity, unitPrice]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const getMyPurchasesSQL = async userId => {
  const sqlQuery = {
    text: 'SELECT * FROM orders WHERE user_id = $1',
    values: [userId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}

export const getMyPurchasesDetailSQL = async (userId, orderId) => {
  const sqlQuery = {
    text: 'select c.id as product_id,c.name as product_name, a.create_date as date, a.order_status , c.product_photo as img,c.id as id,c.name as name,b.unit_price as price ,b.quantity as quantity, a.total_amount as total from orders as a inner join order_items as b on a.id = b.order_id inner join products as c on b.product_id = c.id where a.user_id = $1 and a.id = $2',
    values: [userId, orderId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}
