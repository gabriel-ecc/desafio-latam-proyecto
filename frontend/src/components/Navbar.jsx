// Barra de navegación.
import { useState, useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../context/CartContext.jsx'
import { UserContext } from '../context/UserContext'
import { ENDPOINT } from '../config/constants.js'
import axios from 'axios'

import './Navbar.css'

const Navbar = () => {
  const { calculateTotalPrice } = useCart()
  const total = calculateTotalPrice()
  const { token, user, logout } = useContext(UserContext)

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
    const handleClickOutside = (event) => {
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
  }

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        {/* Asegúrate de que la imagen del logo esté en la carpeta `public/img` */}
        <img
          src="../../public/imgs/logo-ejemplo.jpeg"
          alt="Logo Verdulería Fresca"
        />
      </Link>

      {/* Links de navegación centrales (PC/Tablet) */}
      <div className="nav-desktop-links">
        <ul className="nav-categories-list">
          <li>
            <Link to="/products/season/0">Productos</Link>
          </li>
          {listSeasons.map((season) => (
            <li key={season.id}>
              <Link to={`/products/season/${season.id}`}>{season.name}</Link>
            </li>
          ))}
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
            {' '}
            {/* TODO: Adapta estas categorías a tu verdulería si es necesario */}
            <li>
              <Link to="/products/season/0">Productos</Link>
            </li>
            {listSeasons.map((season) => (
              <li key={season.id}>
                <Link to={`/products/season/${season.id}`}>{season.name}</Link>
              </li>
            ))}
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
              {/* Aquí se usa user.name*/}
              Hola, <strong>Bodoque</strong>
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
                {/* Asegúrate de que la imagen de perfil esté en la carpeta `public/img` */}
                <img
                  src="../../public/imgs/img-perfil.png"
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
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setMobileCategoriesOpen(!isMobileCategoriesOpen)
                    }}
                  >
                    Categorías <i className="fa-solid fa-chevron-right"></i>{' '}
                    {/* TODO: Adapta estas categorías a tu verdulería si es necesario */}
                  </a>
                  <ul className="mobile-submenu">
                    <li>
                      <Link to="/category/verano">Verano</Link>
                    </li>
                    <li>
                      <Link to="/category/otono">Otoño</Link>
                    </li>
                    <li>
                      <Link to="/category/invierno">Invierno</Link>
                    </li>
                    <li>
                      <Link to="/category/primavera">Primavera</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/profile">Mi Perfil</Link>
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
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrar</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
