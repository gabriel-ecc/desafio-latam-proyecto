// Página donde el usuario puede ver y editar la información de su perfil.
import { useState, useEffect, useContext } from 'react'
import { useProfile } from '../hooks/useProfile'
import { updateUserProfile } from '../services/userService'
import { UserContext } from '../context/UserContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faEnvelope,
  faPhone,
  faCamera,
} from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import './Profile.css'

export default function Profile() {
  const { profile, isLoading, loadProfile, updateProfile, isAuthenticated } =
    useProfile()
  const { updateUser } = useContext(UserContext)
  const [editableProfile, setEditableProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePhoto: '',
    userType: '',
    userStatus: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile()
    }
  }, [isAuthenticated, loadProfile])

  // Actualizar el estado editable cuando cambie el perfil
  useEffect(() => {
    if (profile) {
      setEditableProfile(profile)
    }
  }, [profile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditableProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Error',
          text: 'Por favor selecciona solo archivos de imagen',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
        })
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'Error',
          text: 'La imagen debe ser menor a 5MB',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#dc3545',
        })
        return
      }

      setSelectedFile(file)

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updateData = {
        firstName: editableProfile.firstName,
        lastName: editableProfile.lastName,
        phone: editableProfile.phone,
      }

      // Agregar foto si se seleccionó una nueva
      if (selectedFile) {
        updateData.profilePhoto = selectedFile
      }

      const response = await updateUserProfile(updateData)

      // Actualizar el perfil local con los datos devueltos
      updateProfile(response.user)

      // Actualizar también el contexto global del usuario
      updateUser(response.user)

      // Limpiar el archivo seleccionado y preview
      setSelectedFile(null)
      setPreviewUrl(null)
      setIsEditing(false)

      Swal.fire({
        title: '¡Perfil actualizado!',
        text: 'Tus datos han sido guardados correctamente',
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745',
      }).then(() => {
        // Recargar la página para asegurar que todo se actualice
        window.location.reload()
      })
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al actualizar el perfil',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#dc3545',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Restaurar los datos originales
    if (profile) {
      setEditableProfile(profile)
    }
    setIsEditing(false)
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const getPhotoUrl = () => {
    if (previewUrl) return previewUrl
    if (editableProfile.profilePhoto) {
      // Si la foto viene del servidor, construir la URL completa
      return editableProfile.profilePhoto.startsWith('http')
        ? editableProfile.profilePhoto
        : `http://localhost:3000/api/v1/${editableProfile.profilePhoto}`
    }
    return null
  }

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 1:
        return 'Cliente'
      case 2:
        return 'Administrador'
      default:
        return 'Usuario'
    }
  }

  const getUserStatusLabel = (userStatus) => {
    return userStatus === 1 ? 'Activo' : 'Inactivo'
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">Acceso Requerido</h1>
          <p className="profile-subtitle">
            Debes iniciar sesión para ver tu perfil
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Mi Perfil</h1>
        <p className="profile-subtitle">
          Gestiona tu información personal y configuración de tu cuenta
        </p>
      </div>

      <div className="profile-layout">
        {/* Sidebar izquierdo con foto y info básica */}
        <div className="profile-sidebar">
          {/* Sección de foto de perfil */}
          <div className="profile-photo-section">
            <div className="profile-photo-container">
              {getPhotoUrl() ? (
                <img
                  src={getPhotoUrl()}
                  alt="Foto de perfil"
                  className="profile-photo"
                />
              ) : (
                <div className="profile-photo-placeholder">
                  <img
                    src="../../public/imgs/fotoGenerica.png"
                    alt="Foto de perfil"
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <input
                  type="file"
                  id="profilePhoto"
                  className="photo-upload-input"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="profilePhoto" className="photo-upload-button">
                  <FontAwesomeIcon icon={faCamera} className="me-2" />
                  Cambiar foto
                </label>
              </>
            )}
          </div>

          {/* Información básica */}
          <div className="profile-basic-info">
            <div className="profile-name">
              {editableProfile.firstName && editableProfile.lastName
                ? `${editableProfile.firstName} ${editableProfile.lastName}`
                : 'Nombre no disponible'}
            </div>
            <div className="profile-email">
              {editableProfile.email || 'Email no disponible'}
            </div>
            <div className="profile-status">
              {getUserTypeLabel(editableProfile.userType)}
            </div>
          </div>

          {/* Botón de editar perfil en el sidebar */}
          {!isEditing && (
            <button
              type="button"
              className="sidebar-edit-button"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </button>
          )}
        </div>

        {/* Contenido principal con formularios */}
        <div className="profile-content">
          {/* Formulario de perfil */}
          <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
            {/* Información personal */}
            <div className="form-section">
              <h3 className="section-title">Información Personal</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    value={editableProfile.firstName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    value={editableProfile.lastName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={editableProfile.email || ''}
                    disabled
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={editableProfile.phone || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
            </div>

            {/* Información de cuenta */}
            <div className="form-section">
              <h3 className="section-title">Información de Cuenta</h3>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tipo de usuario</label>
                  <input
                    type="text"
                    className="form-input"
                    value={getUserTypeLabel(editableProfile.userType)}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estado de cuenta</label>
                  <input
                    type="text"
                    className="form-input"
                    value={getUserStatusLabel(editableProfile.userStatus)}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="profile-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="loading-spinner"></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
