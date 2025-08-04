// Formulario para que un administrador cree un nuevo empleado.
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { getToken } from '../services/authService'
import './AuthForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ENDPOINT } from '../config/constants.js'
import Swal from 'sweetalert2'
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone
} from '@fortawesome/free-solid-svg-icons'

export default function CreateEmployee() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  // Verificar que solo administradores puedan acceder
  useEffect(() => {
    if (!user || user.userType !== 3) {
      Swal.fire({
        title: 'Acceso denegado',
        text: 'Solo los administradores pueden crear empleados.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      }).then(() => {
        navigate('/usuarios')
      })
    }
  }, [user, navigate])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    // Validación de contraseña
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      })
      setLoading(false)
      return
    }

    // Construir el objeto a enviar
    const employeeData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      userType: 2 // Tipo empleado
    }

    try {
      const token = getToken()

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(ENDPOINT.employees, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(employeeData)
      })

      const data = await response.json()

      if (response.ok) {
        await Swal.fire({
          title: 'Empleado creado!',
          text: `El empleado ${employeeData.firstName} ${employeeData.lastName} ha sido creado correctamente.`,
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#28a745'
        })

        navigate('/usuarios')
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Error al crear empleado',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#dc3545'
        })
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al crear empleado',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#dc3545'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/usuarios')
  }

  // No renderizar si no es administrador
  if (!user || user.userType !== 3) {
    return null
  }

  return (
    <div className="auth-bg">
      <div className="auth-card shadow">
        <form className="register-form employee-form" onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <h2 className="auth-title mb-1">Crear Empleado</h2>
            <p className="auth-subtitle">
              Registra un nuevo empleado en el sistema
            </p>
          </div>

          <div className="form-row">
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  placeholder="Nombre"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  placeholder="Apellido"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Teléfono"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <>
                <output
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></output>{' '}
                Creando empleado...
              </>
            ) : (
              'Crear Empleado'
            )}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleGoBack}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
