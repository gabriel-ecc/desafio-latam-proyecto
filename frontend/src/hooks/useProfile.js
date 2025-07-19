import { useState, useContext, useCallback } from 'react'
import { UserContext } from '../context/UserContext'
import { getUserProfile } from '../services/userService'
import { isAuthenticated } from '../services/authService'

export const useProfile = () => {
  const { user, setUser } = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadProfile = useCallback(async () => {
    if (!isAuthenticated()) {
      setError('Usuario no autenticado')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const profileData = await getUserProfile()
      setProfile(profileData)

      // Actualizar contexto si no existe o está desactualizado
      if (!user || user.email !== profileData.email) {
        setUser(profileData)
      }

      return profileData
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar perfil:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [user, setUser])

  const updateProfile = useCallback(
    (updatedData) => {
      setProfile((prev) => ({ ...prev, ...updatedData }))
      if (user) {
        setUser((prev) => ({ ...prev, ...updatedData }))
      }
    },
    [user, setUser]
  )

  const clearProfile = useCallback(() => {
    setProfile(null)
    setError(null)
  }, [])

  return {
    profile,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    clearProfile,
    isAuthenticated: isAuthenticated(),
  }
}
