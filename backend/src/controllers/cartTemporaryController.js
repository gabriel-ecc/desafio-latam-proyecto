import { getOrCreateTemporaryCart, updateItemCart } from '../models/cartTemporaryModel.js'

const getTemporaryCart = async (req, res) => {
  try {
    const { userId } = req.query
    if (!userId) return res.status(400).json({ error: 'userId es requerido' })
    const cart = await getOrCreateTemporaryCart(userId)
    res.status(200).json(cart)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener el carrito' })
  }
}

const putItem = async (req, res) => {
  try {
    const { orderId, items } = req.body
    if (!orderId) return res.status(400).json({ error: 'orderId es requerido' })

    for (const item of items) {
      const { product_id, quantity, unit_price } = item
      await updateItemCart(orderId, product_id, quantity, unit_price)
    }
    res.json({ message: 'Carrito temporal actualizado con éxito' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar el carrito' })
  }
}

export { getTemporaryCart, putItem }
