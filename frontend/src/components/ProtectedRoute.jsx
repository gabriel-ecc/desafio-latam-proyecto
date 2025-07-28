import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Swal from 'sweetalert2'
import PropTypes from 'prop-types'

/**
 * Componente HOC para proteger rutas basado en permisos de usuario
 * @param {Object} props
 * @param {React.Component} props.children - Componente hijo a renderizar si tiene permisos
 * @param {Array} props.allowedUserTypes - Array de tipos de usuario permitidos (ej: [2, 3] para empleados y admin)
 * @param {string} props.redirectTo - Ruta de redirección (por defecto '/')
 */
export default function ProtectedRoute({
  children,
  allowedUserTypes = [],
  redirectTo = '/'
}) {
  const { user, isLoading: userLoading, hasLoggedOut } = useContext(UserContext)
  const navigate = useNavigate()

  // Verificar permisos del usuario inmediatamente
  useEffect(() => {
    // Si ya terminó de cargar el contexto del usuario
    if (!userLoading) {
      // Si no hay usuario o no tiene permisos
      if (!user || !allowedUserTypes.includes(user.userType)) {
        // Si el usuario cerró sesión intencionalmente, no mostrar mensaje
        if (hasLoggedOut) {
          navigate(redirectTo)
        } else {
          // Solo mostrar mensaje si no cerró sesión intencionalmente
          Swal.fire({
            title: 'Acceso denegado',
            text: 'No tienes permisos para acceder a esta sección.',
            icon: 'error',
            confirmButtonColor: '#dc3545'
          }).then(() => {
            navigate(redirectTo)
          })
        }
        return
      }
    }
  }, [user, userLoading, navigate, allowedUserTypes, redirectTo, hasLoggedOut])

  // Si aún está cargando el contexto del usuario, mostrar loading
  if (userLoading) {
    return (
      <div
        className="loading-container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          fontSize: '1.2rem',
          color: '#666'
        }}
      >
        <div className="loading-message">Cargando...</div>
      </div>
    )
  }

  // Si ya terminó de cargar y no hay usuario o no tiene permisos, no mostrar nada
  // (el useEffect ya maneja la redirección)
  if (!user || !allowedUserTypes.includes(user.userType)) {
    return null
  }

  // Si tiene permisos, renderizar el componente hijo
  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedUserTypes: PropTypes.array,
  redirectTo: PropTypes.string
}
