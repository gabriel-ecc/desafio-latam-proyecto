// Formulario para que un usuario cree una nueva cuenta.
// El rol se asigna por el administrador en Users.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone
} from '@fortawesome/free-solid-svg-icons'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validación de contraseña
    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    // Construir el objeto a enviar
    const userData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      userType: 1
    }

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        await Swal.fire({
          title: 'Usuario registrado!',
          text: `Hola ${userData.firstName}, tu cuenta ha sido creada correctamente.`,
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#28a745'
        })

        navigate('/Login')
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Error al crear usuario',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#dc3545'
        })
      }
    } catch (error) {
      console.error(error)
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al crear usuario',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#dc3545'
      })
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card shadow">
        <form onSubmit={handleSubmit}>
          <h2 className="auth-title">Crear una cuenta</h2>
          <p className="auth-subtitle">
            ¡Los mejores productos orgánicos te esperan!.
          </p>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          <div className="mb-3">
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
                required
              />
            </div>
          </div>
          {/* a espera de que se implemente la subida de fotos de perfil en el backend ya que pide instalar multer */}
          {/* <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="file"
                className="form-control"
                name="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div> */}
          <button type="submit" className="btn btn-success w-100 fw-bold">
            Registrarme
          </button>
          <p className="auth-login">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>.
          </p>
        </form>
      </div>
    </div>
  )
}
