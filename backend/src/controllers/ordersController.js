import { createOrderCartModel, addOrderItemModel } from '../models/ordersModel.js'

const postCartOrder = async (req, res) => {
  try {
    const { userId = req.body.user_id, items, deliveryType, shippingAddress, recipientName } = req.body

    console.log('Payload recibido:', req.body)
    const totalAmount = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    const payload = req.body
    const newOrder = await createOrderCartModel({
      userId: payload.user_id,
      orderStatus: payload.order_status,
      deliveryType: payload.delivery_type,
      shippingAddress: payload.shipping_address,
      recipientName: payload.recipient_name,
      totalAmount: payload.total_amount
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
