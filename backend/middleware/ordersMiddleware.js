import { getProductById } from '../src/models/productsModel.js'

export const validateStockOnPurchase = async (req, res, next) => {
  try {
    const { items } = req.body
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: `Lista de items vacia`
      })
    }
    const stockValidationPromises = items.map(async item => {
      const product = await getProductById(item.product_id)
      if (!product || product.stock < item.quantity) {
        return {
          valid: false,
          name: product ? product.product_name : `ID ${item.product_id}`,
          stock: product ? product.stock : 0,
          requested: item.quantity
        }
      }
      return { valid: true }
    })

    const validationResults = await Promise.all(stockValidationPromises)

    const invalidItem = validationResults.find(result => !result.valid)

    if (invalidItem) {
      return res.status(400).json({
        message: `No hay suficiente stock para el producto "${invalidItem.name}". Stock disponible: ${invalidItem.stock}, cantidad solicitada: ${invalidItem.requested}.`
      })
    }

    next()
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: `Error en la validación de stock: ${error.message}` })
  }
}
