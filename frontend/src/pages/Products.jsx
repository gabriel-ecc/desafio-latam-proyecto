import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Card'
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
    axios.get(ENDPOINT.products, { params: queryParams }).then(({ data }) => {
      if (favorites.length > 0) {
        const productWithFavorites = data.results.map(a => ({
          ...a,
          isFavorite: favorites.some(q => q.productid === a.id) || false
        }))
        setCards(productWithFavorites)
      } else {
        setCards(data.results)
      }

      data.totalProducts % limits === 0
        ? setCantidadPaginas(Math.trunc(data.totalProducts / limits))
        : setCantidadPaginas(Math.trunc(data.totalProducts / limits) + 1)
    })
  }, [selectedCategory, selectedSeason, page, orderBy, limits])

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

  return (
    <div className="container">
      <div>
        {/* Aquí va el contenido*/}
        <h2 className="text-center my-4">Nuestros Productos</h2>
      </div>
      <div className="filters-container">
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
            {listCategories.map(category => (
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
            {listSeasons.map(season => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="order-filter">Ordenar por:</label>
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
          <label htmlFor="limit-filter">Mostrar:</label>
          <select
            id="limit-filter"
            value={limits}
            onChange={e => {
              setLimits(parseInt(e.target.value))
              setPage(1)
            }}
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
          </select>
        </div>
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
            <p>No hay productos disponibles.</p>
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
