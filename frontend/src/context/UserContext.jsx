import { createContext, useState, useEffect, useMemo } from 'react'
import { getToken } from '../services/authService'
import { getUserProfile } from '../services/userService'
import PropTypes from 'prop-types'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoggedOut, setHasLoggedOut] = useState(false)

  // Función para cargar el usuario desde la API
  const loadUserFromToken = async () => {
    try {
      const userData = await getUserProfile()
      setUser(userData)
      setHasLoggedOut(false) // Reset logout flag when user is loaded
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
    setHasLoggedOut(true)
    localStorage.removeItem('authToken')
  }

  const updateUser = userData => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }))
    setHasLoggedOut(false) // Reset logout flag when user is updated
  }

  const login = userData => {
    setUser(userData)
    setHasLoggedOut(false)
  }

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    user,
    setUser,
    token,
    setToken,
    login,
    logout,
    updateUser,
    isLoading,
    hasLoggedOut
  }), [user, token, isLoading, hasLoggedOut])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
}
