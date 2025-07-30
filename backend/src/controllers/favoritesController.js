import {
  addFavoriteSQL,
  updateFavoriteSQL,
  searchFavoriteSQL,
  getFavoritesSQL
} from '../models/favoritesModels.js'

export const actionFavorite = async (userId, productId) => {
  try {
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

export const getFavoritesPaginated = async (userId, req, res) => {
  try {
    const favorites = await getFavoritesSQL(userId, req.query)
    res.status(200).json(favorites)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
