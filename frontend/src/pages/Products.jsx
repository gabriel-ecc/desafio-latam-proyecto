import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Card'
import SearchBar from '../components/SearchBar'
import './Products.css'
import useCart from '../context/CartContext.jsx'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import axios from 'axios'

// Muestra todos los productos disponibles en la tienda sin filtros (para el administrador).
export default function Products() {
  const [searchParams] = useSearchParams()
  const season = searchParams.get('season')
  const category = searchParams.get('category')
  const [cards, setCards] = useState([])
  const [allProducts, setAllProducts] = useState([]) // Para el SearchBar
  const [selectedCategory, setSelectedCategory] = useState(
    category === '0' ? '' : category || ''
  )
  const { favorites, handleActionFavorite } = useContext(FavoriteContext)
  const [listCategories, setListCategories] = useState([])
  const [selectedSeason, setSelectedSeason] = useState(
    season === '0' ? '' : season || ''
  )
  const [listSeasons, setListSeasons] = useState([])
  const [orderBy, setOrderBy] = useState('price_ASC')
  const [page, setPage] = useState(1)
  const [limits, setLimits] = useState(9)
  const { addToCart } = useCart()
  const [cantidadPaginas, setCantidadPaginas] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Sincroniza el estado del filtro de temporada con el parámetro de la URL
    setSelectedSeason(season === '0' ? '' : season || '')
    setSelectedCategory(category === '0' ? '' : category || '')
    setPage(1)
  }, [season, category])

  useEffect(() => {
    const queryParams = {
      limits: limits,
      category: selectedCategory,
      season: selectedSeason,
      page: page,
      orderBy: orderBy,
      ...(searchTerm && { search: searchTerm })
    }

    axios.get(ENDPOINT.products, { params: queryParams }).then(({ data }) => {
      if (favorites.length > 0) {
        const productWithFavorites = data.results.map(a => ({
          ...a,
          isFavorite: favorites.some(q => q.id === a.id) || false
        }))
        setCards(productWithFavorites)
      } else {
        setCards(data.results)
      }

      data.totalProducts % limits === 0
        ? setCantidadPaginas(Math.trunc(data.totalProducts / limits))
        : setCantidadPaginas(Math.trunc(data.totalProducts / limits) + 1)
    })

    // Cargar todos los productos para el SearchBar (solo una vez)
    if (allProducts.length === 0) {
      axios
        .get(ENDPOINT.products, { params: { limits: 1000 } })
        .then(({ data }) => {
          const allProductsWithFavorites = data.results.map(product => ({
            ...product,
            isFavorite: favorites.some(fav => fav.id === product.id) || false
          }))
          setAllProducts(allProductsWithFavorites)
        })
    }
  }, [
    selectedCategory,
    selectedSeason,
    page,
    orderBy,
    limits,
    searchTerm,
    favorites,
    allProducts.length
  ])

  useEffect(() => {
    axios.get(ENDPOINT.seasons).then(({ data }) => {
      setListSeasons(data)
    })
    axios.get(ENDPOINT.categories).then(({ data }) => {
      setListCategories(data)
    })
  }, [])

  const handleViewMore = id => {
    navigate(`/card/${id}`)
  }

  const handleToggleFavorite = id => {
    handleActionFavorite(id)
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    )
  }

  const handleAddToCart = productWithQuantity => {
    const { quantity, ...product } = productWithQuantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  // Función para manejar la búsqueda
  const handleSearch = term => {
    setSearchTerm(term)
    setIsSearching(term.length >= 2)
    setPage(1) // Resetear a la primera página cuando se busca
  }

  // Función para manejar selección de producto desde SearchBar
  const handleProductSelect = product => {
    navigate(`/card/${product.id}`)
  }

  return (
    <div className="container products-page">
      {/* Header Banner Temático */}
      <div className="products-header">
        <div className="header-content">
          <div className="header-icons">
            <span className="icon">🥕</span>
            <span className="icon">🥬</span>
            <span className="icon">🍎</span>
          </div>
          <h1 className="products-title">Nuestros Productos Frescos</h1>
          <p className="products-subtitle">
            Directamente del campo a tu mesa • Calidad garantizada • Precios
            justos
          </p>
          <div className="header-icons">
            <span className="icon">🍊</span>
            <span className="icon">🥒</span>
            <span className="icon">🍇</span>
          </div>
        </div>
      </div>

      <div>
        {/* Barra de búsqueda */}
        <div className="search-container">
          <SearchBar
            products={allProducts}
            onProductSelect={handleProductSelect}
            placeholder="Buscar por producto, categoría o temporada..."
            className="products-search"
          />
        </div>

        {isSearching && (
          <div className="search-info">
            <p className="search-text">
              🔍 Mostrando resultados para: "<strong>{searchTerm}</strong>"
            </p>
            <button
              onClick={() => handleSearch('')}
              className="clear-search-btn"
            >
              ✖ Limpiar búsqueda
            </button>
          </div>
        )}
      </div>

      {!isSearching && (
        <div className="filters-container">
          <div className="filters-header">
            <h3 className="filters-title">🌱 Filtrar Productos</h3>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="category-filter">
                <span className="filter-icon">🥗</span> Categoría:
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Todas las categorías</option>
                {listCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="season-filter">
                <span className="filter-icon">🌿</span> Temporada:
              </label>
              <select
                id="season-filter"
                value={selectedSeason}
                onChange={e => {
                  setSelectedSeason(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Todas las temporadas</option>
                {listSeasons.map(season => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="order-filter">
                <span className="filter-icon">🔄</span> Ordenar por:
              </label>
              <select
                id="order-filter"
                value={orderBy}
                onChange={e => {
                  setOrderBy(e.target.value)
                  setPage(1)
                }}
              >
                <option value="id_ASC">Relevancia</option>
                <option value="price_ASC">Precio: Menor a Mayor</option>
                <option value="price_DESC">Precio: Mayor a Menor</option>
                <option value="productname_ASC">Nombre: A-Z</option>
                <option value="productname_DESC">Nombre: Z-A</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="limit-filter">
                <span className="filter-icon">👁</span> Mostrar:
              </label>
              <select
                id="limit-filter"
                value={limits}
                onChange={e => {
                  setLimits(parseInt(e.target.value))
                  setPage(1)
                }}
              >
                <option value="3">3 productos</option>
                <option value="6">6 productos</option>
                <option value="9">9 productos</option>
                <option value="12">12 productos</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="card-container">
        {cards.length > 0 ? (
          cards.map(card => (
            <ProductCard
              key={card.id}
              product={card}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewMore}
            />
          ))
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🥺</div>
            <p>
              {isSearching
                ? `No se encontraron productos para "${searchTerm}"`
                : 'No hay productos disponibles en este momento.'}
            </p>
            <p className="no-products-subtitle">
              {isSearching
                ? 'Intenta con otro término de búsqueda'
                : 'Pronto tendremos productos frescos para ti'}
            </p>
          </div>
        )}
      </div>
      {cantidadPaginas > 1 ? (
        <nav
          aria-label="Page navigation"
          className="d-flex justify-content-center mt-4"
        >
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Anterior
              </button>
            </li>

            {Array.from({ length: cantidadPaginas }, (_, i) => i + 1).map(
              pageNumber => (
                <li
                  key={pageNumber}
                  className={`page-item ${page === pageNumber ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${page === cantidadPaginas ? 'disabled' : ''}`}
            >
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      ) : (
        <></>
      )}
    </div>
  )
}
