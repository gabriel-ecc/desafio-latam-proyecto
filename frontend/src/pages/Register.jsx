// Formulario para que un usuario cree una nueva cuenta.
// El rol se asigna por el administrador en Users.jsx
import { useState } from "react"
import "./AuthForm.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí estará la lógica para el registro (probando compatibilidad con backend...)
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
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <input
                type="tel"
                className="form-control"
                name="phoneNumber"
                placeholder="Teléfono"
                value={form.phoneNumber}
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
                placeholder="Dirección de correo electrónico"
                value={form.email}
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
