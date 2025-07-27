// Funciones para obtener, crear, editar o eliminar usuarios.
import { ENDPOINT } from '../config/constants.js'
import { getToken } from './authService.js'

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const response = await fetch(`${ENDPOINT.users}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al obtener el perfil')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión.')
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
}

// Función para actualizar el perfil del usuario
export const updateUserProfile = async userData => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    // Crear FormData para enviar tanto datos como archivos
    const formData = new FormData()

    // Agregar los campos al FormData
    if (userData.firstName) formData.append('firstName', userData.firstName)
    if (userData.lastName) formData.append('lastName', userData.lastName)
    if (userData.phone) formData.append('phone', userData.phone)
    if (userData.profilePhoto instanceof File) {
      formData.append('profilePhoto', userData.profilePhoto)
    }

    const response = await fetch(`${ENDPOINT.users}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
        // No establecer Content-Type, el navegador lo hará automáticamente para FormData
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al actualizar el perfil')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión.')
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
}

// Función para obtener lista de usuarios (clientes)
export const getUsers = async (page = 1, limits = 10) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const response = await fetch(
      `${ENDPOINT.users}?page=${page}&limits=${limits}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al obtener usuarios')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión.')
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
}

// Función para obtener lista de empleados
export const getEmployees = async (page = 1, limits = 10) => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const response = await fetch(
      `${ENDPOINT.users}/employee?page=${page}&limits=${limits}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al obtener empleados')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión.')
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
}

// Función para bloquear/desbloquear usuario
export const toggleUserStatus = async userId => {
  try {
    const token = getToken()

    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    const response = await fetch(`${ENDPOINT.users}/lock/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al cambiar estado del usuario')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('No se puede conectar al servidor. Verifica tu conexión.')
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
}
