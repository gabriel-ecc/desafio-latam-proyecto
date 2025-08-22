// Lista de productos que el usuario ha marcado como favoritos.
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Card'
import './Products.css'
import { useContext, useEffect, useState } from 'react'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import BackButton from '../components/BackButton'
import useCart from '../context/CartContext.jsx'
import { toast } from '../utils/swalHelper.js'

export default function Favorites() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const season = searchParams.get('season')
  const [cards, setCards] = useState([])
  const { addToCart } = useCart()
  const { favorites, handleActionFavorite } = useContext(FavoriteContext)
  const [selectedCategory, setSelectedCategory] = useState(
    category === '0' ? '' : category || ''
  )
  const [selectedSeason, setSelectedSeason] = useState(
    season === '0' ? '' : season || ''
  )
  const [orderBy] = useState('price_ASC')
  const [page, setPage] = useState(1)
  const [limits] = useState(9)
  const [cantidadPaginas, setCantidadPaginas] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Sincroniza el estado del filtro de temporada con el parámetro de la URL
    setSelectedSeason(season === '0' ? '' : season || '')
    setSelectedCategory(category === '0' ? '' : category || '')
    setPage(1)
  }, [season, category])

  useEffect(() => {
    // Calcular el número total de páginas
    favorites.length % limits === 0
      ? setCantidadPaginas(Math.trunc(favorites.length / limits))
      : setCantidadPaginas(Math.trunc(favorites.length / limits) + 1)

    // Aplicar paginación: calcular el índice de inicio y fin
    const startIndex = (page - 1) * limits
    const endIndex = startIndex + limits
    const paginatedFavorites = favorites.slice(startIndex, endIndex)

    setCards(paginatedFavorites)
  }, [selectedCategory, selectedSeason, page, orderBy, limits, favorites])

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

  const handleAddToCart = async productWithQuantity => {
    const { quantity, ...product } = productWithQuantity
    const success = await addToCart(product, quantity)
    if (success) {
      toast({
        icon: 'success',
        title: `Has agregado ${quantity} ${product.name}${
          quantity > 1 ? 's' : ''
        } al carrito.`
      })
    } else {
      toast({
        icon: 'warning',
        title: `No se pudo agregar la cantidad deseada. Stock insuficiente para ${
          product.name
        }.`
      })
    }
  }

  return (
    <div className="container products-page">
      {/* Header Banner Temático para Favoritos */}
      <div className="products-header">
        <div className="header-content">
          <div className="header-icons">
            <span className="icon">❤️</span>
            <span className="icon">⭐</span>
            <span className="icon">💚</span>
          </div>
          <h1 className="products-title">Mis Favoritos</h1>
          <p className="products-subtitle">
            Tus productos preferidos • Guardados para ti • Siempre disponibles
          </p>
          <div className="header-icons">
            <span className="icon">🥕</span>
            <span className="icon">🍎</span>
            <span className="icon">🥬</span>
          </div>
        </div>
      </div>

      {/* Información de estadísticas de favoritos */}
      {favorites.length > 0 && (
        <div className="favorites-stats">
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-icon">❤️</span>
              <div className="stat-content">
                <div className="stat-number">{favorites.length}</div>
                <div className="stat-label">
                  {favorites.length === 1
                    ? 'Producto favorito'
                    : 'Productos favoritos'}
                </div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📦</span>
              <div className="stat-content">
                <div className="stat-number">{cards.length}</div>
                <div className="stat-label">
                  {page === 1 ? 'Mostrando' : `Página ${page}`}
                </div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💝</span>
              <div className="stat-content">
                <div className="stat-number">
                  $
                  {favorites
                    .reduce((total, product) => total + product.price, 0)
                    .toLocaleString('es-CL')}
                </div>
                <div className="stat-label">Valor total</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor principal de contenido */}
      <div className="favorites-content">
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
              <div className="no-products-icon">💔</div>
              <p>No tienes productos en Favoritos</p>
              <p className="no-products-subtitle">
                Explora nuestros productos y agrega tus favoritos con el corazón
                ❤️
              </p>
              <div className="no-products-actions">
                <button
                  className="explore-products-btn"
                  onClick={() => navigate('/products')}
                >
                  🛒 Explorar Productos
                </button>
              </div>
            </div>
          )}
        </div>
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

      <BackButton />
    </div>
  )
}
