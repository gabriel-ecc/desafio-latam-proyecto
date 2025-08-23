import { productsHATEOAS } from '../helpers/productsHateoas.js'
import {
  getProductsByPage,
  getProductsCount,
  getProductById,
  createProductSQL,
  updateProductSQL,
  getInventoryByPage,
  getInventoryCount,
  getProductsFrontPage,
  changeProductStatus
} from '../models/productsModel.js'
import 'dotenv/config'
import { getChileanSeason } from '../helpers/seasonHelper.js'

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsByPage(req.query)
    const count = await getProductsCount(req.query)
    const productsWithHATEOAS = await productsHATEOAS(
      'products',
      products,
      count
    )
    res.status(200).json(productsWithHATEOAS)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const getInventory = async (req, res) => {
  try {
    console.log('=== INVENTORY SEARCH DEBUG ===')
    console.log('Query params:', req.query)
    console.log('Search term:', req.query.search)

    const products = await getInventoryByPage(req.query)

    const count = await getInventoryCount(req.query)

    const productsWithHATEOAS = await productsHATEOAS(
      'products',
      products,
      count
    )

    res.status(200).json(productsWithHATEOAS)
  } catch (error) {
    console.error('Error in getInventory:', error)
    return res.status(500).json({ error: error.message })
  }
}

export const getProduct = async (req, res) => {
  const port = process.env.port || 3000
  try {
    const { id } = req.params
    const queryResult = await getProductById(id)
    const product = {
      id: queryResult.id,
      name: queryResult.product_name,
      description: queryResult.description,
      price: queryResult.price,
      stock: queryResult.stock,
      img: queryResult.img,
      category: queryResult.category,
      categoryId: queryResult.category_id,
      season: queryResult.season,
      seasonId: queryResult.season_id
    }
    product.img = `${process.env.RENDER_EXTERNAL_URL}/api/v1/uploads/${product.img}`
    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const createProduct = async (req, res) => {
  try {
    const productData = req.body
    const productPhotoFile = req.file // 1. Obtenemos el archivo desde req.file

    if (productPhotoFile) {
      // 2. Si el archivo existe, construimos su ruta relativa y la añadimos a los datos del producto
      productData.productPhoto = productPhotoFile.filename
    }

    const product = await createProductSQL(productData)

    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const productData = req.body
    const productPhotoFile = req.file
    if (productPhotoFile) {
      productData.productPhoto = productPhotoFile.filename
    }
    const product = await updateProductSQL(id, productData)

    res.status(200).json({ id, product })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export const productListFrontPage = async (req, res) => {
  const { limits = 6 } = req.query
  const currentDate = new Date()
  const currentSeason = getChileanSeason(currentDate)
  try {
    const products = await getProductsFrontPage(req.query, currentSeason)
    const productsWithHATEOAS = await productsHATEOAS(
      'products',
      products,
      limits
    )
    res.status(200).json(productsWithHATEOAS)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const product = await changeProductStatus(id, status)

    const message = status ? 'Producto habilitado' : 'Producto deshabilitado'
    res.status(200).json({
      message,
      product: {
        id: product.id,
        name: product.name,
        status: product.status
      }
    })
  } catch (error) {
    console.error('Error in toggleProductStatus:', error)
    return res.status(500).json({ error: error.message })
  }
}
