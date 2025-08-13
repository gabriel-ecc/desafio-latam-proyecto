import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import { UserContext } from '../context/UserContext'
import Swal from 'sweetalert2'
import BackButton from '../components/BackButton'
import './Inventory.css'

// Página para que el administrador/empleado vea y gestione el inventario de productos.
export default function Inventory() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')
  const [searchTerm, setSearchTerm] = useState('') // Para filtrar productos (usado en la API)
  const [searchInput, setSearchInput] = useState('') // Para el input inmediato (sin debounce)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [limits, setLimits] = useState(10)

  // Productos expandidos (para mostrar detalles)
  const [expandedProducts, setExpandedProducts] = useState(new Set())

  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  
  // Ref para mantener el foco en el input de búsqueda
  const searchInputRef = useRef(null)
  const [shouldMaintainFocus, setShouldMaintainFocus] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, seasonsRes] = await Promise.all([
          axios.get(ENDPOINT.categories),
          axios.get(ENDPOINT.seasons)
        ])
        setCategories(categoriesRes.data)
        setSeasons(seasonsRes.data)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }
    fetchInitialData()
  }, [])

  // Cargar productos del inventario
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true)
      const token = getToken()

      if (!token) {
        setError('No tienes autorización para ver el inventario.')
        return
      }

      const params = {
        page,
        limits,
        category: selectedCategory,
        season: selectedSeason,
        search: searchTerm
      }

      const response = await axios.get(ENDPOINT.inventory, {
        headers: { Authorization: `Bearer ${token}` },
        params
      })

      console.log('=== INVENTORY RESPONSE ===')
      console.log('Full response data:', response.data)
      console.log('Products array:', response.data.results)
      console.log('First product:', response.data.results?.[0])

      setProducts(response.data.results)
      setTotalPages(Math.ceil(response.data.totalProducts / limits))
      setError(null)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('No tienes autorización para ver el inventario.')
        Swal.fire({
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          icon: 'warning',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          navigate('/login')
        })
      } else {
        setError('Error al cargar el inventario.')
      }
    } finally {
      setLoading(false)
    }
  }, [page, limits, selectedCategory, selectedSeason, searchTerm, navigate])

  useEffect(() => {
    if (user) {
      fetchInventory()
    }
  }, [user, fetchInventory])

  // Debounce para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput)
      setPage(1) // Reiniciar a la primera página cuando cambia la búsqueda
    }, 500) // 500ms de retraso

    return () => clearTimeout(timer)
  }, [searchInput])

  // Restaurar el foco en el input de búsqueda después de que se actualicen los productos
  useEffect(() => {
    if (shouldMaintainFocus && searchInputRef.current && document.activeElement !== searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current.focus()
        // Mover el cursor al final del texto
        const length = searchInputRef.current.value.length
        searchInputRef.current.setSelectionRange(length, length)
        setShouldMaintainFocus(false)
      }, 50) // Pequeño delay para asegurar que el DOM se ha actualizado

      return () => clearTimeout(timer)
    }
  }, [products, shouldMaintainFocus])

  // Alternar expansión de producto
  const toggleProductExpansion = productId => {
    const newExpanded = new Set(expandedProducts)
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId)
    } else {
      newExpanded.add(productId)
    }
    setExpandedProducts(newExpanded)
  }

  // Editar producto
  const handleEditProduct = productId => {
    navigate(`/editar-producto/${productId}`)
  }

  // Habilitar/Deshabilitar producto (solo admin)
  const handleToggleProductStatus = async product => {
    if (user.userType !== 3) {
      Swal.fire({
        title: 'Acceso denegado',
        text: 'Solo los administradores pueden habilitar/deshabilitar productos.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      })
      return
    }

    const action = product.status ? 'deshabilitar' : 'habilitar'
    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} producto?`,
      text: `¿Estás seguro que deseas ${action} "${product.productname}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: product.status ? '#dc3545' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        const token = getToken()
        const response = await axios.put(
          `${ENDPOINT.products}/lock/${product.id}`,
          { status: !product.status },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        console.log('Server response:', response.data)

        // ÚNICA actualización: usar exactamente el valor del servidor
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === product.id
              ? { ...p, status: response.data.product.status }
              : p
          )
        )

        Swal.fire({
          title: '¡Éxito!',
          text: `Producto ${action}do correctamente.`,
          icon: 'success',
          confirmButtonColor: '#28a745'
        })
      } catch (error) {
        console.error('Error toggling product status:', error)
        Swal.fire({
          title: 'Error',
          text: `Error al ${action} el producto.`,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        })
      }
    }
  }

  // Crear nuevo producto
  // Función para manejar cambios en el input de búsqueda
  const handleSearchChange = value => {
    setSearchInput(value) // Actualizar el input inmediatamente
    setShouldMaintainFocus(true) // Activar el flag para mantener el foco
    // El searchTerm se actualizará automáticamente con debounce
  }

  const handleCreateProduct = () => {
    navigate('/editar-producto/0')
  }

  if (loading && products.length === 0) {
    return (
      <div className="inventory-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando inventario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="inventory-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="inventory-container">
      <BackButton />
      <div className="inventory-header">
        <h1>Inventario de Productos</h1>
        <button onClick={handleCreateProduct} className="btn btn-success">
          <i className="fa-solid fa-plus"></i> Crear Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-container">
        {/* SearchBar para búsqueda de productos */}
        <div className="filter-group search-group">
          <span className="filter-label">Buscar productos:</span>
          <div className="search-controls">
            <input
              ref={searchInputRef}
              type="text"
              value={searchInput}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Escriba para buscar productos..."
              className="search-input"
            />
          </div>
        </div>

        {/* Contenedor para los 3 selectores */}
        <div className="selectors-row">
          <div className="filter-group">
            <label htmlFor="category-filter">Categoría:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todas</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="season-filter">Temporada:</label>
            <select
              id="season-filter"
              value={selectedSeason}
              onChange={e => {
                setSelectedSeason(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Todas</option>
              {seasons.map(season => (
                <option key={season.id} value={season.id}>
                  {season.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="limit-filter">Mostrar:</label>
            <select
              id="limit-filter"
              value={limits}
              onChange={e => {
                setLimits(parseInt(e.target.value))
                setPage(1)
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="products-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-item">
              <button
                className="product-summary"
                onClick={() => toggleProductExpansion(product.id)}
                aria-expanded={expandedProducts.has(product.id)}
                aria-label={`${expandedProducts.has(product.id) ? 'Contraer' : 'Expandir'} detalles de ${product.productname}`}
              >
                <div className="product-basic-info">
                  <div className="product-image">
                    <img
                      src={
                        product.img.startsWith('http')
                          ? product.img
                          : `http://localhost:3000/api/v1/uploads/${product.img}`
                      }
                      alt={product.productname}
                      onError={e => {
                        e.target.src = '/imgs/fotoGenerica.png'
                      }}
                    />
                  </div>
                  <div className="product-main-info">
                    <h3>{product.productname}</h3>
                    <div className="product-meta">
                      <span className="category">{product.category}</span>
                      <span className="season">{product.season}</span>
                      <span
                        className={`status ${product.status ? 'active' : 'inactive'}`}
                      >
                        {product.status ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="product-price-stock">
                  <div className="price">
                    ${product.price?.toLocaleString('es-cl')}
                  </div>
                  <div className={`stock ${product.stock < 10 ? 'low' : ''}`}>
                    Stock: {product.stock}
                  </div>
                </div>
                <div className="expand-icon">
                  <i
                    className={`fa-solid fa-chevron-${expandedProducts.has(product.id) ? 'up' : 'down'}`}
                  ></i>
                </div>
              </button>

              {/* Detalles expandidos */}
              {expandedProducts.has(product.id) && (
                <div className="product-details">
                  <div className="product-description">
                    <h4>Descripción</h4>
                    <p>{product.description || 'Sin descripción disponible'}</p>
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleEditProduct(product.id)
                      }}
                      className="btn btn-primary"
                    >
                      <i className="fa-solid fa-edit"></i> Editar
                    </button>

                    {user?.userType === 3 && (
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleToggleProductStatus(product)
                        }}
                        className={`btn ${product.status ? 'btn-danger' : 'btn-success'}`}
                      >
                        <i
                          className={`fa-solid fa-${product.status ? 'ban' : 'check'}`}
                        ></i>
                        {product.status ? 'Deshabilitar' : 'Habilitar'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No hay productos en el inventario.</p>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn btn-outline-secondary"
          >
            Anterior
          </button>

          <span className="page-info">
            Página {page} de {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="btn btn-outline-secondary"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
