import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/Card'
import './Products.css'
import useCart from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import axios from 'axios'

// Muestra todos los productos disponibles en la tienda sin filtros (para el administrador).
export default function Products() {
  const [cards, setCards] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [listCategories, setListCategories] = useState([])
  const [selectedSeason, setSelectedSeason] = useState('')
  const [listSeasons, setListSeasons] = useState([])
  const [orderBy, setOrderBy] = useState('price_ASC')
  const [page, setPage] = useState(1)
  const [limits, setLimits] = useState(12)
  const { addToCart } = useCart()
  const [cantidadPaginas, setCantidadPaginas] = useState(1)
  const navigate = useNavigate()

  const queryParams = {
    limits: limits,
    category: selectedCategory,
    season: selectedSeason,
    page: page,
    orderBy: orderBy,
  }

  useEffect(() => {
    axios.get(ENDPOINT.products, { params: queryParams }).then(({ data }) => {
      setCards(data.results)
      setCantidadPaginas(data.totalPages)
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

  const handleViewMore = (id) => {
    navigate(`/card/${id}`)
  }

  const handleToggleFavorite = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    )
  }

  const handleAddToCart = (productWithQuantity) => {
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
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas</option>
            {listCategories.map((category) => (
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
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            <option value="">Todas</option>
            {listSeasons.map((season) => (
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
            onChange={(e) => setOrderBy(e.target.value)}
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
            onChange={(e) => setLimits(parseInt(e.target.value))}
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
          </select>
        </div>
      </div>
      <div className="row card-container">
        {cards.map((card) => (
          <div className="col-lg-3 col-md-5 mb-4" key={card.id}>
            <ProductCard
              product={card}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewMore}
            />
          </div>
        ))}
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
