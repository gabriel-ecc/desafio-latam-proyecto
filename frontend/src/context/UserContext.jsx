import { createContext, useState, useEffect } from 'react'
import { getToken } from '../services/authService'
import { getUserProfile } from '../services/userService'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para cargar el usuario desde la API
  const loadUserFromToken = async () => {
    try {
      const userData = await getUserProfile()
      setUser(userData)
    } catch (error) {
      console.error('Error al cargar usuario:', error)
      // Si hay error, limpiar el token inválido
      localStorage.removeItem('authToken')
      setToken(null)
    }
  }

  // Inicializar usuario y token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken()
      if (storedToken) {
        setToken(storedToken)
        await loadUserFromToken()
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }))
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
