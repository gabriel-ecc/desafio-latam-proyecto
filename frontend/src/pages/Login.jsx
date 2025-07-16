import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { loginUser, getUserData, saveToken } from '../services/authService'
import Swal from 'sweetalert2'
import './AuthForm.css'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { setUser, setToken } = useContext(UserContext)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Llamar al servicio de login
      const loginResponse = await loginUser(form)
      const { token } = loginResponse

      // Guardar token en localStorage
      saveToken(token)
      setToken(token)

      // Obtener datos del usuario
      const userData = await getUserData(token)
      setUser(userData)

      // Mostrar mensaje de éxito (SweetAlert por mientras para más claridad.)
      await Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${userData.nameLastName}, has iniciado sesión correctamente.`,
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745'
      })

      // Redirigir según el rol del usuario
      if (userData.rol === 'admin') {
        navigate('/usuarios')
      } else {
        navigate('/catalogo')
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión')

      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al iniciar sesión',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#dc3545'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card shadow">
        <form onSubmit={handleSubmit}>
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">
            ¡Disfruta de las mejores verduras de La Gata de Campo!.
          </p>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <output
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></output>
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
          <p className="auth-login">
            ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>.
          </p>
        </form>
      </div>
    </div>
  )
}
