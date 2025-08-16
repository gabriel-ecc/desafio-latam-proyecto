import { createOrderCartModel, addOrderItemModel } from '../models/ordersModel.js'

const postCartOrder = async (req, res) => {
  try {
    const userId = req.user
    const {
      order_status,
      delivery_type,
      shipping_address,
      recipient_name,
      items
    } = req.body

    const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    const newOrder = await createOrderCartModel({
      userId,
      orderStatus: order_status,
      deliveryType: delivery_type,
      shippingAddress: shipping_address,
      recipientName: recipient_name,
      totalAmount
    })

    for (const item of items) {
      await addOrderItemModel(newOrder.id, item.product_id, item.quantity, item.unit_price)
    }
    res.status(201).json({ message: 'Carrito Generado', orderId: newOrder.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al guardar el carrito' })
  }
}

export default postCartOrder
