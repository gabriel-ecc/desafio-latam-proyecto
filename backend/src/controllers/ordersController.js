import { productsHATEOAS } from '../helpers/productsHateoas.js'
import {
  getMyPurchasesSQL,
  getMyPurchasesDetailSQL,
  createOrderCartModel,
  addOrderItemModel
} from '../models/ordersModel.js'

export const getMyPurchases = async (req, res) => {
  const userId = req.user
  try {
    const purchases = await getMyPurchasesSQL(userId)
    res.status(200).json(purchases)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const getMyPurchasesDetail = async (req, res) => {
  const userId = req.user
  const orderId = req.params.id
  try {
    const purchases = await getMyPurchasesDetailSQL(userId, orderId)
    res.status(200).json(purchases)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const postCartOrder = async (req, res) => {
  try {
    const { userId, items, deliveryType, shippingAddress, recipientName } =
      req.body

    console.log('Payload recibido:', req.body)
    const totalAmount = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    )
    const newOrder = await createOrderCartModel({
      userId,
      orderStatus: 1,
      deliveryType,
      shippingAddress,
      recipientName,
      totalAmount
    })

    for (const item of items) {
      await addOrderItemModel(
        newOrder.id,
        item.product_id,
        item.quantity,
        item.unit_price
      )
    }
    res.status(201).json({ message: 'Carrito Generado', orderId: newOrder.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al guardar el carrito' })
  }
}


