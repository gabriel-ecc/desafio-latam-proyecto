import { orderDetailsFormat } from '../helpers/ordersHelper.js'
import {
  getMyPurchasesSQL,
  getMyPurchasesDetailSQL,
  createOrderCartModel,
  addOrderItemModel,
  updateStock,
  getAllPurchasesSQL,
  getAllPurchasesDetailSQL,
  updateOrderStatusSQL
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
    const data = await getMyPurchasesDetailSQL(userId, orderId)
    const purchasesDetail = await orderDetailsFormat(data)
    res.status(200).json({ purchasesDetail })
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const postCartOrder = async (req, res) => {
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

    if (order_status === 2 || order_status === 3) {
      await updateStock(newOrder.id)
    }

    res.status(201).json({ message: 'Carrito Generado', order_id: newOrder.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al guardar el carrito' })
  }
}

// Obtener todas las compras (para admin/empleado)
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await getAllPurchasesSQL()
    res.status(200).json(purchases)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

// Obtener detalles de cualquier compra (para admin/empleado)
export const getAllPurchasesDetail = async (req, res) => {
  const orderId = req.params.id
  try {
    const data = await getAllPurchasesDetailSQL(orderId)
    const purchasesDetail = await orderDetailsFormat(data)
    res.status(200).json({ purchasesDetail })
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

// Actualizar estado de un pedido (para admin/empleado)
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id
  const { order_status } = req.body
  
  try {
    const updatedOrder = await updateOrderStatusSQL(orderId, order_status)
    
    // Si el estado cambia a 2 o 3, actualizar stock
    if (order_status === 2 || order_status === 3) {
      await updateStock(orderId)
    }
    
    res.status(200).json({ 
      message: 'Estado del pedido actualizado exitosamente', 
      order: updatedOrder 
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar el estado del pedido' })
  }
}
