const API_URL = 'http://localhost:3000/api'

// Función para hacer login
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error en el login')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'No se puede conectar al servidor. Verifica tu conexión.',
      )
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
};

// Función para obtener datos del usuario
export const getUserData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener datos del usuario')
    }

    const data = await response.json()
    return data;
  } catch (error) {
    // Manejo específico para errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'No se puede conectar al servidor. Verifica tu conexión.',
      )
    }

    // Manejo específico para errores de JSON parsing
    if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      throw new Error('Error en la respuesta del servidor.')
    }

    // Re-lanzar el error original si ya tiene un mensaje personalizado
    throw error
  }
};

// Función para guardar token en localStorage
export const saveToken = (token) => {
  localStorage.setItem('authToken', token)
};

// Función para obtener token de localStorage
export const getToken = () => {
  return localStorage.getItem('authToken')
};

// Función para eliminar token
export const removeToken = () => {
  localStorage.removeItem('authToken')
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  return token !== null;
}
