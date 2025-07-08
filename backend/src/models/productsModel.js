import pool from '../../db/schema/config.js'
import format from 'pg-format'

export const getProductsCount = async () => {
  const sqlQuery = {
    text: 'SELECT count(1) as cantidad FROM products',
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const getProductsByPage = async ({
  limits = 10,
  page = 1,
  orderBy = 'id_ASC',
  season = '',
  category = '',
}) => {
  const filtros = []
  const valores = []

  if (category) {
    filtros.push('b.id = %L')
    valores.push(category)
  }
  if (season) {
    filtros.push('c.id = %L')
    valores.push(season)
  }

  const [columna, direccion] = orderBy.split('_')
  const offset = Math.abs((page - 1) * limits)
  let sqlQuery =
    'SELECT a.id,a.name as product_name,a.price,a.product_photo, b.name as category, c.name as season FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN seasonal_category AS c on a.seasonal_category_id = c.id'
  if (filtros.length > 0) {
    const sqlWhere = format(' WHERE ' + filtros.join(' AND '), ...valores)
    sqlQuery += sqlWhere
  }
  
  const queryWithFormat = format(
    sqlQuery + ' ORDER BY %I %s LIMIT %s OFFSET %s',
    columna,
    direccion,
    limits,
    offset
  )

  console.log(queryWithFormat)
  const { rows: productList } = await pool.query(queryWithFormat)
  return productList
}

export const getProductById = async (id) => {
  const sqlQuery = {
    text: 'SELECT a.id,a.name as product_name,a.description,a.price,a.stock,a.product_photo,b.name as category,c.name as season,a.create_date,a.update_date FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN seasonal_category AS c on a.seasonal_category_id = c.id WHERE a.id = $1',
    values: [id],
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}
