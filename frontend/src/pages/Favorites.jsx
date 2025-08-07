// Lista de productos que el usuario ha marcado como favoritos.
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Card'
import './Products.css'
import { useContext, useEffect, useState } from 'react'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import BackButton from '../components/BackButton'
import axios from 'axios'
import useCart from '../context/CartContext.jsx'

export default function Favorites() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const season = searchParams.get('season')
  const [cards, setCards] = useState([])
  const [listCategories, setListCategories] = useState([])
  const { addToCart } = useCart()
  const { favorites, handleActionFavorite } = useContext(FavoriteContext)
  const [selectedCategory, setSelectedCategory] = useState(
    category === '0' ? '' : category || ''
  )
  const [selectedSeason, setSelectedSeason] = useState(
    season === '0' ? '' : season || ''
  )
  const [listSeasons, setListSeasons] = useState([])
  const [orderBy, setOrderBy] = useState('price_ASC')
  const [page, setPage] = useState(1)
  const [limits, setLimits] = useState(9)

  const [cantidadPaginas, setCantidadPaginas] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    // Sincroniza el estado del filtro de temporada con el parámetro de la URL
    setSelectedSeason(season === '0' ? '' : season || '')
    setSelectedCategory(category === '0' ? '' : category || '')
    setPage(1)
  }, [season, category])

  const queryParams = {
    limits: limits,
    category: selectedCategory,
    season: selectedSeason,
    page: page,
    orderBy: orderBy
  }

  useEffect(() => {
    axios.get(ENDPOINT.seasons).then(({ data }) => {
      setListSeasons(data)
    })
    axios.get(ENDPOINT.categories).then(({ data }) => {
      setListCategories(data)
    })
  }, [])

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

  const handleAddToCart = productWithQuantity => {
    const { quantity, ...product } = productWithQuantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div>
      <BackButton />
      <div className="container">
        <div>
          <h2 className="text-center my-4">Mis Favoritos</h2>
        </div>

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
              <p>No tienes productos en Favoritos</p>
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
    </div>
  )
}
