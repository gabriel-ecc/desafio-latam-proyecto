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
    text: 'INSERT INTO orders (user_id, order_status, delivery_type, shipping_address, recipient_name, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
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
    text: 'SELECT * FROM orders WHERE user_id = $1 order by id desc',
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

export const updateStock = async orderId => {
  const itemQuery = {
    text: 'UPDATE products SET stock = stock - oi.quantity FROM order_items oi WHERE oi.order_id = $1 AND products.id = oi.product_id RETURNING products.id, products.stock',
    values: [orderId]
  }
  const itemsRes = await pool.query(itemQuery)
  return itemsRes.rows
}

// Función para obtener todas las compras (admin)
export const getAllPurchasesSQL = async () => {
  const sqlQuery = {
    text: `SELECT o.*, u.name as user_name, u.email as user_email 
           FROM orders o 
           INNER JOIN users u ON o.user_id = u.id 
           ORDER BY o.id DESC`,
    values: []
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}

// Función para obtener detalles de cualquier compra (admin)
export const getAllPurchasesDetailSQL = async (orderId) => {
  const sqlQuery = {
    text: `SELECT c.id as product_id, c.name as product_name, a.create_date as date, 
           a.order_status, c.product_photo as img, c.id as id, c.name as name, 
           b.unit_price as price, b.quantity as quantity, a.total_amount as total,
           u.name as user_name, u.email as user_email
           FROM orders as a 
           INNER JOIN order_items as b ON a.id = b.order_id 
           INNER JOIN products as c ON b.product_id = c.id 
           INNER JOIN users as u ON a.user_id = u.id
           WHERE a.id = $1`,
    values: [orderId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows
}

// Función para actualizar el estado de un pedido
export const updateOrderStatusSQL = async (orderId, newStatus) => {
  const sqlQuery = {
    text: 'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
    values: [newStatus, orderId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
