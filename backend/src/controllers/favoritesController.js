import {
  addFavoriteSQL,
  updateFavoriteSQL,
  searchFavoriteSQL,
  getFavoritesSQL
} from '../models/favoritesModels.js'
import { favortiesHelper } from '../helpers/favoritesHelper.js'

export const actionFavorite = async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.user
    const existingFavorite = await searchFavoriteSQL(userId, productId)
    if (existingFavorite) {
      return res.status(200).json(updateFavoriteSQL(existingFavorite.id))
    } else {
      return res.status(200).json(addFavoriteSQL(userId, productId))
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const getFavoritesPaginated = async (req, res) => {
  const userId = req.user
  try {
    const favorites = await getFavoritesSQL(userId, req.query)
    res.status(200).json(await favortiesHelper(favorites))
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}

export const getFavorite = async (req, res) => {
  const userId = req.user
  const productId = req.params.id
  try {
    const favorite = await searchFavoriteSQL(userId, productId)
    res.status(200).json(favorite)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
