import { useState } from "react"
import "./AuthForm.css"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí va la lógica de login
  }

  return (
    <div className="auth-bg">
      <div className="auth-card shadow">
        <form onSubmit={handleSubmit}>
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">
            ¡Disfruta de las mejores verduras de La Gata de Campo!.
          </p>
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
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 fw-bold">
            Ingresar
          </button>
          <p className="auth-login">
            ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>.
          </p>
        </form>
      </div>
    </div>
  )
}