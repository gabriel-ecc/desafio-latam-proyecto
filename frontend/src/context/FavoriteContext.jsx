import { createContext, useState, useEffect, useContext } from 'react'
import { getFavorites, actionFavorite } from '../services/favoritesService.js'
import { UserContext } from './UserContext'

export const FavoriteContext = createContext()

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const { user } = useContext(UserContext)

  const fetchFavorites = async () => {
    if (!user) return
    try {
      const favoritesData = await getFavorites()
      setFavorites(favoritesData)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    }
  }

  const handleActionFavorite = async productId => {
    try {
      await actionFavorite(productId)
      fetchFavorites() // Re-fetch para actualizar la lista
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [user])

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        actionFavorite,
        fetchFavorites,
        handleActionFavorite
      }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}
