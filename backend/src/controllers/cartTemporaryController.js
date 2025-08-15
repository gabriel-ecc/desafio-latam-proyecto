import { getOrCreateTemporaryCart, updateItemCart, replaceCartItems } from '../models/cartTemporaryModel.js'

const getTemporaryCart = async (req, res) => {
  try {
    const { userId } = req.body
    const cart = await getOrCreateTemporaryCart(userId)
    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el carrito' })
  }
}

const putItem = async (req, res) => {
  try {
    const { orderId, cart, productId, quantity, unitPrice } = req.body
    if (!orderId) {
      return res.status(400).json({ error: 'orderId es requerido' })
    }
    if (cart && Array.isArray(cart)) {
      // Caso 1: reemplazar todo el carrito
      await replaceCartItems(orderId, cart)
      return res.json({ message: 'Carrito reemplazado con éxito' })
    }

    if (productId && quantity != null && unitPrice != null) {
      // Caso 2: agregar/actualizar solo un producto
      await updateItemCart(orderId, productId, quantity, unitPrice)
      return res.json({ message: 'Producto agregado/actualizado con éxito' })
    }
    return res.status(400).json({ error: 'Datos inválidos para actualizar carrito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar el carrito' })
  }
}

export { getTemporaryCart, putItem }
