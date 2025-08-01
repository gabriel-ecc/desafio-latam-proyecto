import { data } from 'react-router-dom'
import { ENDPOINT } from '../config/constants.js'
import { getToken } from './authService.js'

// Función para obtener los favoritos de un usuario
export const getFavorites = async () => {
  try {
    const token = getToken()
    if (!token) throw new Error('No hay token de autenticación')

    const response = await fetch(`${ENDPOINT.favoritesMy}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al obtener los favoritos')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en getFavorites:', error)
    throw error
  }
}

// Función para agregar un producto a favoritos
export const actionFavorite = async productId => {
  const product = {
    productId: productId
  }

  try {
    const token = getToken()
    if (!token) throw new Error('No hay token de autenticación')

    const response = await fetch(`${ENDPOINT.favoritesAction}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al agregar a favoritos')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en addFavorite:', error)
    throw error
  }
}
