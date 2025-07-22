import pool from '../../db/schema/config.js'
import format from 'pg-format'

export const getProductsCount = async ({
  limits = 10,
  page = 1,
  orderBy = 'id_ASC',
  season = '',
  category = ''
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

  let sqlQuery =
    'SELECT count(1) as cantidad FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id WHERE a.status = true AND a.stock > 0'
  if (filtros.length > 0) {
    const sqlWhere = format(' AND ' + filtros.join(' AND '), ...valores)
    sqlQuery += sqlWhere
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const getProductsByPage = async ({
  limits = 10,
  page = 1,
  orderBy = 'id_ASC',
  season = '',
  category = ''
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
    'SELECT a.id, a.name as productname, a.price, a.stock, a.product_photo as img, b.name as category,b.id as category_id, c.name as season,c.id as season_id FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id WHERE a.status = true AND a.stock > 0'
  if (filtros.length > 0) {
    const sqlWhere = format(' AND ' + filtros.join(' AND '), ...valores)
    sqlQuery += sqlWhere
  }

  const queryWithFormat = format(
    sqlQuery + ' ORDER BY %I %s LIMIT %s OFFSET %s',
    columna,
    direccion,
    limits,
    offset
  )

  const { rows: productList } = await pool.query(queryWithFormat)
  return productList
}

export const getProductById = async id => {
  const sqlQuery = {
    text: 'SELECT a.id,a.name as product_name,a.description,a.price,a.stock,a.product_photo as img,b.name as category, b.id as category_id, c.name as season, c.id as season_id, a.create_date,a.update_date FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id WHERE a.id = $1',
    values: [id]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const createProductSQL = async productData => {
  const {
    name,
    description,
    price,
    stock,
    productCategory,
    seasonCategory,
    productPhoto
  } = productData

  const partes = productPhoto.split('/')
  const nombreImagen = partes[partes.length - 1]

  const sqlQuery = {
    text: 'INSERT INTO products (name, description, price, stock, product_category_id, season_category_id, product_photo, status) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
    values: [
      name,
      description,
      price,
      stock,
      productCategory,
      seasonCategory,
      nombreImagen
    ]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const updateProductSQL = async (id, productData) => {
  const {
    name,
    description,
    price,
    stock,
    productCategory,
    seasonCategory,
    productPhoto,
    filename
  } = productData

  const partes = productPhoto.split('/')
  const nombreImagen = partes[partes.length - 1]

  const sqlQuery = {
    text: 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, product_category_id = $5, season_category_id = $6, product_photo = $7 WHERE id = $8 RETURNING *',
    values: [
      name,
      description,
      price,
      stock,
      productCategory,
      seasonCategory,
      nombreImagen,
      id
    ]
  }
  const response = await pool.query(sqlQuery)
  return response.rows[0]
}


export const getInventoryCount = async ({
  limits = 20,
  page = 1,
  orderBy = 'id_ASC',
  season = '',
  category = ''
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

  let sqlQuery =
    'SELECT count(1) as cantidad FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id'
  if (filtros.length > 0) {
    const sqlWhere = format(' WHERE ' + filtros.join(' AND '), ...valores)
    sqlQuery += sqlWhere
  }

  const response = await pool.query(sqlQuery)
  return response.rows[0]
}

export const getInventoryByPage = async ({
  limits = 20,
  page = 1,
  orderBy = 'id_ASC',
  season = '',
  category = ''
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
    'SELECT a.id, a.name as productname, a.price, a.stock, a.product_photo as img, b.name as category,b.id as category_id, c.name as season,c.id as season_id FROM products AS a INNER JOIN product_category as b ON a.product_category_id = b.id INNER JOIN season_category AS c on a.season_category_id = c.id'
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

  const { rows: productList } = await pool.query(queryWithFormat)
  return productList
}