import { productsHATEOAS } from '../helpers/productsHateoas.js'
import {
  getMyPurchasesSQL,
  getMyPurchasesDetailSQL
} from '../models/ordersModel'

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
