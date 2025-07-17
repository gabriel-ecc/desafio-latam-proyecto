import { productsHATEOAS } from '../helpers/productsHateoas.js'
import {
  getProductsByPage,
  getProductsCount,
  getProductById,
  createProductSQL,
  updateProductSQL,
} from '../models/productsModel.js'
import 'dotenv/config'

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

export const getProduct = async (req, res) => {
  const port = process.env.port || 3000
  try {
    const { id } = req.params
    const product = await getProductById(id)
    product.img = `http://localhost:${port}/api/v1/uploads/${product.img}`
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
