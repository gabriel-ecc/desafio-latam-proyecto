// Barra de navegación.
import { useState, useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useCart from '../context/CartContext.jsx'
import { UserContext } from '../context/UserContext'
import { ENDPOINT } from '../config/constants.js'
import axios from 'axios'

import './Navbar.css'

const Navbar = () => {
  const { totalPrice } = useCart()
  const total = totalPrice()
  const { token, user, logout } = useContext(UserContext)
  const navigate = useNavigate()

  // Estados para controlar la visibilidad de los menús desplegables
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false)
  const [isTabletCategoriesOpen, setTabletCategoriesOpen] = useState(false)
  const [isMobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [listSeasons, setListSeasons] = useState([])

  // Refs para detectar clics fuera de los menús
  const profileMenuRef = useRef(null)
  const tabletCategoriesRef = useRef(null)

  // Hook para cerrar los menús si se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false)
      }
      if (
        tabletCategoriesRef.current &&
        !tabletCategoriesRef.current.contains(event.target)
      ) {
        setTabletCategoriesOpen(false)
      }
    }

    axios.get(ENDPOINT.seasons).then(({ data }) => {
      setListSeasons(data)
    })

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false) // Cierra el menú al cerrar sesión
    navigate('/') // Redirige al home después de cerrar sesión
  }

  return (
    <nav className="navbar">
      <div className="order">
        <Link to="/" className="nav-logo">
          {/* Asegúrate de que la imagen del logo esté en la carpeta `public/img` */}
          <img src="/imgs/logo-ejemplo.jpeg" alt="Logo Verdulería Fresca" />
        </Link>

        {/* Links de navegación centrales (PC/Tablet) */}
        <div className="nav-desktop-links">
          <ul className="nav-categories-list">
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/products">Productos</Link>
            </li>

            {/* Mostrar temporadas solo para clientes (userType === 1) o usuarios no logueados */}
            {(!user || user.userType === 1) &&
              listSeasons.map(season => (
                <li key={season.id}>
                  <Link to={`/products?season=${season.id}`}>
                    {season.name}
                  </Link>
                </li>
              ))}

            {/* Mostrar botones solo para empleados y administradores */}
            {user && (user.userType === 2 || user.userType === 3) && (
              <>
                <li>
                  <Link to="/inventario">Inventario</Link>
                </li>
                <li>
                  <Link to="/editar-producto/0">Nuevo Producto</Link>
                </li>
                <li>
                  <Link to="/usuarios">Gestión de Usuarios</Link>
                </li>
              </>
            )}
          </ul>
          <div
            className={`dropdown nav-tablet-categories ${
              isTabletCategoriesOpen ? 'is-open' : ''
            }`}
            ref={tabletCategoriesRef}
          >
            <button
              className="categories-btn"
              onClick={() => setTabletCategoriesOpen(!isTabletCategoriesOpen)}
            >
              Menú <i className="fa-solid fa-chevron-down"></i>
            </button>
            <ul className="dropdown-content">
              {/* TODO: Adapta estas categorías a tu verdulería si es necesario */}
              <li>
                <Link to="/products">Productos</Link>
              </li>

              {/* Mostrar temporadas solo para clientes (userType === 1) o usuarios no logueados */}
              {(!user || user.userType === 1) &&
                listSeasons.map(season => (
                  <li key={season.id}>
                    <Link to={`products?season=${season.id}`}>
                      {season.name}
                    </Link>
                  </li>
                ))}

              {/* Mostrar botones solo para empleados y administradores */}
              {user && (user.userType === 2 || user.userType === 3) && (
                <>
                  <li>
                    <Link to="/inventario">Inventario</Link>
                  </li>
                  <li>
                    <Link to="/editar-producto/0">Nuevo Producto</Link>
                  </li>
                  <li>
                    <Link to="/usuarios">Gestión de Usuarios</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Controles de la derecha */}
        <div className="nav-right">
          <Link to="/cart" className="nav-cart">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="cart-total">${total.toLocaleString()}</span>
          </Link>

          {token && user ? (
            <>
              <span className="nav-greeting">
                {' '}
                {/* Mostrar el nombre real del usuario */}
                Hola, <strong>{user?.firstName || 'Usuario'}</strong>
              </span>
              <div
                className={`dropdown dropdown-right nav-profile-menu ${
                  isProfileMenuOpen ? 'is-open' : ''
                }`}
                ref={profileMenuRef}
              >
                <button
                  className="profile-btn"
                  title="Mi Perfil"
                  onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                >
                  {/* Mostrar la foto de perfil del usuario o una imagen por defecto */}
                  <img
                    src={
                      user?.profilePhoto
                        ? user.profilePhoto.startsWith('http')
                          ? user.profilePhoto
                          : `http://localhost:3000/api/v1/${user.profilePhoto}`
                        : '/imgs/fotoGenerica.png'
                    }
                    alt="Foto de perfil"
                  />
                  <i className="fa-solid fa-chevron-down profile-chevron"></i>
                </button>
                <ul className="dropdown-content">
                  <li
                    className={`nav-mobile-link nav-mobile-dropdown ${
                      isMobileCategoriesOpen ? 'is-open' : ''
                    }`}
                  >
                    <a
                      href="#!"
                      className="category-toggle"
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMobileCategoriesOpen(!isMobileCategoriesOpen)
                      }}
                    >
                      Categorías <i className="fa-solid fa-chevron-right"></i>{' '}
                      {/* TODO: Adapta estas categorías a tu verdulería si es necesario */}
                    </a>
                    <ul className="mobile-submenu">
                      {/* Mostrar temporadas solo para clientes (userType === 1) o usuarios no logueados */}
                      {(!user || user.userType === 1) &&
                        listSeasons.map(season => (
                          <li key={season.id}>
                            <Link to={`products?season=${season.id}`}>
                              {season.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </li>

                  {/* Mostrar opciones solo para empleados y administradores */}
                  {user && (user.userType === 2 || user.userType === 3) && (
                    <>
                      <li>
                        <Link to="/inventario">Inventario</Link>
                      </li>
                      <li>
                        <Link to="/editar-producto/0">Nuevo Producto</Link>
                      </li>
                      <li>
                        <Link to="/usuarios">Gestión de Usuarios</Link>
                      </li>
                      <li className="dropdown-divider"></li>
                    </>
                  )}

                  <li>
                    <Link to="/profile">Mi Perfil</Link>
                  </li>
                  <li>
                    <Link to="/favoritos">Mis Favoritos</Link>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li>
                    {/* Usamos un botón para la acción de cerrar sesión */}
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="nav-auth-links">
              <Link to="/login" className="auth-button">
                <i className="fas fa-user"></i>
                Ingresar / Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
