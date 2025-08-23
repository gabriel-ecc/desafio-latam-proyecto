// Vista para que un administrador vea la lista de usuarios registrados.
import { useState, useEffect, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import { UserContext } from '../context/UserContext'
import Swal from 'sweetalert2'
import BackButton from '../components/BackButton'
import './Users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUserType, setSelectedUserType] = useState('clients') // 'clients' o 'employees'
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limits, setLimits] = useState(10)

  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  // Verificar permisos del usuario inmediatamente
  useEffect(() => {
    // Asegurar que los empleados solo vean clientes
    if (user && user.userType === 2 && selectedUserType === 'employees') {
      setSelectedUserType('clients')
    }
  }, [user, selectedUserType])

  // Función para obtener usuarios según el tipo seleccionado
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const endpoint =
        selectedUserType === 'clients'
          ? `${ENDPOINT.users}?page=${page}&limits=${limits}`
          : `${ENDPOINT.users}/employee?page=${page}&limits=${limits}`

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setUsers(response.data.users || [])
      setTotalPages(Math.ceil(response.data.count / limits))
      setError(null)
    } catch (error) {
      console.error('Error fetching users:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('No tienes autorización para ver los usuarios.')
        Swal.fire({
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          icon: 'warning',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          navigate('/login')
        })
      } else {
        setError('Error al cargar los usuarios.')
      }
    } finally {
      setLoading(false)
    }
  }, [selectedUserType, page, limits, navigate])

  // Cargar usuarios cuando cambie el tipo seleccionado, página o límites
  useEffect(() => {
    // Solo cargar si el usuario tiene permisos
    if (user && (user.userType === 2 || user.userType === 3)) {
      fetchUsers()
    }
  }, [user, fetchUsers])

  // Cambiar tipo de usuario y resetear página
  const handleUserTypeChange = userType => {
    setSelectedUserType(userType)
    setPage(1) // Resetear a la primera página
  }

  // Función para bloquear/desbloquear usuario
  const handleToggleUserStatus = async (userId, currentStatus, userName) => {
    if (user.userType !== 3) {
      Swal.fire({
        title: 'Acceso denegado',
        text: 'Solo los administradores pueden bloquear/desbloquear usuarios.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      })
      return
    }

    const action = currentStatus === 1 ? 'bloquear' : 'desbloquear'
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`,
      text: `¿Estás seguro que deseas ${action} a "${userName}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus === 1 ? '#dc3545' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        const token = getToken()
        const response = await axios.put(
          `${ENDPOINT.users}/lock/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        // Actualizar la lista de usuarios
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId
              ? { ...user, user_status: currentStatus === 1 ? 0 : 1 }
              : user
          )
        )

        Swal.fire({
          title: 'Éxito',
          text: response.data.message || `Usuario ${action}ado correctamente`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        })
      } catch (error) {
        console.error('Error toggling user status:', error)
        Swal.fire({
          title: 'Error',
          text:
            error.response?.data?.message || `Error al ${action} el usuario`,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        })
      }
    }
  }

  // Función para obtener el label del tipo de usuario
  const getUserTypeLabel = userType => {
    switch (userType) {
      case 1:
        return 'Cliente'
      case 2:
        return 'Empleado'
      case 3:
        return 'Administrador'
      default:
        return 'Usuario'
    }
  }

  // Función para obtener el label del estado del usuario
  const getUserStatusLabel = userStatus => {
    return userStatus === 1 ? 'Activo' : 'Bloqueado'
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Gestión de Usuarios</h1>
        <p className="users-subtitle">
          Administra los usuarios registrados en el sistema
        </p>
      </div>

      <div className="users-content">
        <BackButton />

        {/* Selector de tipo de usuario */}
        <div className="user-type-selector">
          <button
            className={`selector-btn ${selectedUserType === 'clients' ? 'active' : ''}`}
            onClick={() => handleUserTypeChange('clients')}
          >
            <i className="fas fa-users"></i> Clientes
          </button>
          {/* Solo mostrar el botón de empleados si el usuario es administrador */}
          {user.userType === 3 && (
            <>
              <button
                className={`selector-btn ${selectedUserType === 'employees' ? 'active' : ''}`}
                onClick={() => handleUserTypeChange('employees')}
              >
                <i className="fas fa-user-tie"></i> Empleados
              </button>
              <button
                className="selector-btn create-employee-btn"
                onClick={() => navigate('/create-employee')}
                title="Crear nuevo empleado"
              >
                <i className="fas fa-user-plus"></i> Crear Empleado
              </button>
            </>
          )}
        </div>

        {/* Controles de paginación superior */}
        <div className="users-controls">
          <div className="pagination-info">
            <span>Mostrando {users.length} usuarios</span>
          </div>
          <div className="limits-selector">
            <label htmlFor="limits">Mostrar:</label>
            <select
              id="limits"
              value={limits}
              onChange={e => {
                setLimits(parseInt(e.target.value))
                setPage(1)
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>por página</span>
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error al cargar usuarios</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchUsers}>
              <i className="fas fa-redo"></i> Reintentar
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-container">
            <i className="fas fa-user-slash"></i>
            <h3>
              No hay {selectedUserType === 'clients' ? 'clientes' : 'empleados'}{' '}
              registrados
            </h3>
            <p>No se encontraron usuarios de este tipo en el sistema.</p>
          </div>
        ) : (
          <>
            {/* Lista de usuarios */}
            <div className="users-list">
              {users.map(userData => (
                <div key={userData.id} className="user-card">
                  <div className="user-info">
                    <div className="user-avatar">
                      {userData.profile_photo ? (
                        <img
                          src={
                            userData.profile_photo.startsWith('http')
                              ? userData.profile_photo
                              : `${import.meta.env.VITE_API_URL}/api/v1/${userData.profile_photo}`
                          }
                          alt={`${userData.first_name} ${userData.last_name}`}
                        />
                      ) : (
                        <img
                          src="/imgs/fotoGenerica.png"
                          alt={`${userData.first_name} ${userData.last_name}`}
                        />
                      )}
                    </div>
                    <div className="user-details">
                      <h3 className="user-name">
                        {userData.first_name} {userData.last_name}
                      </h3>
                      <p className="user-email">
                        <i className="fas fa-envelope"></i> {userData.email}
                      </p>
                      <div className="user-meta">
                        <span
                          className={`user-type ${getUserTypeLabel(userData.user_type).toLowerCase()}`}
                        >
                          <i className="fas fa-tag"></i>{' '}
                          {getUserTypeLabel(userData.user_type)}
                        </span>
                        <span
                          className={`user-status ${userData.user_status === 1 ? 'active' : 'blocked'}`}
                        >
                          <i
                            className={`fas ${userData.user_status === 1 ? 'fa-check-circle' : 'fa-ban'}`}
                          ></i>{' '}
                          {getUserStatusLabel(userData.user_status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones del usuario (solo para administradores) */}
                  {user.userType === 3 && (
                    <div className="user-actions">
                      <button
                        className={`action-btn ${userData.user_status === 1 ? 'block' : 'unblock'}`}
                        onClick={() =>
                          handleToggleUserStatus(
                            userData.id,
                            userData.user_status,
                            `${userData.first_name} ${userData.last_name}`
                          )
                        }
                        title={
                          userData.user_status === 1
                            ? 'Bloquear usuario'
                            : 'Desbloquear usuario'
                        }
                      >
                        <i
                          className={`fas ${userData.user_status === 1 ? 'fa-ban' : 'fa-unlock'}`}
                        ></i>{' '}
                        {userData.user_status === 1
                          ? 'Bloquear'
                          : 'Desbloquear'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <i className="fas fa-chevron-left"></i> Anterior
                </button>

                <div className="pagination-info">
                  <span>
                    Página {page} de {totalPages}
                  </span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Siguiente <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
