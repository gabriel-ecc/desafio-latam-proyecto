import pool from '../../db/schema/config.js'
import format from 'pg-format'

export const addFavoriteSQL = async (userId, productId) => {
  const sqlQuery = {
    text: 'INSERT INTO client_favorites (user_id, product_id, is_favorite) VALUES ($1, $2, true) RETURNING *',
    values: [userId, productId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const updateFavoriteSQL = async id => {
  const sqlQuery = {
    text: 'UPDATE client_favorites SET is_favorite = NOT is_favorite WHERE id = $1 RETURNING *',
    values: [id]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const searchFavoriteSQL = async (userId, productId) => {
  const sqlQuery = {
    text: 'SELECT * FROM client_favorites WHERE user_id = $1 AND product_id = $2',
    values: [userId, productId]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const getFavoritesSQL = async (
  userId,
  { limits = 10, page = 1, orderBy = 'productId_ASC' }
) => {
  const [columna, direccion] = orderBy.split('_')
  const offset = Math.abs((page - 1) * limits)
  const sqlQuery =
    'SELECT a.id as productId, a.name as productName, a.price, a.stock, a.product_photo as img, a.product_photo as img, b.name as category,b.id as categoryId, c.name as season,c.id as seasonId, f.id as favoriteId FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id INNER JOIN client_favorites AS f ON a.id = f.product_id WHERE f.user_id = %L AND f.is_favorite = true'
  const queryWithFormat = format(
    sqlQuery + ' ORDER BY %s %s LIMIT %s OFFSET %s',
    userId,
    columna,
    direccion,
    limits,
    offset
  )
  const { rows: productList } = await pool.query(queryWithFormat)
  return productList
}
