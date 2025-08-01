// Página de inicio. Muestra la bienvenida, productos destacados e información general.
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../pages/Home.css'
import '../components/Card.css'
import ProductCard from '../components/Card'
import useCart from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import { FavoriteContext } from '../context/FavoriteContext.jsx'

export default function Home() {
  const [cards, setCards] = useState([])
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { favorites, handleActionFavorite, fetchFavorites } =
    useContext(FavoriteContext)

  // Imágenes del panel deslizable (ajusta las rutas si es necesario)
  const sliderImages = [
    { id: 1, src: '/imgs/delibery.jpg', alt: 'Ofertas especiales' },
    { id: 2, src: '/imgs/agosto.jpg', alt: 'Promoción de frutas' },
    { id: 3, src: '/imgs/septiembre.jpg', alt: 'Ofertas especiales' },
    { id: 4, src: '/imgs/beneficios.jpg', alt: 'Verduras de temporada' },
    { id: 5, src: '/imgs/mas.jpg', alt: 'Verduras de temporada' }
  ]

  useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

  // Cargar productos del backend al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(ENDPOINT.productsFrontPage, {
          params: { limits: 6 } // Mostrar solo X productos en el home
        })
        const transformedProducts = response.data.results.map(product => ({
          ...product,
          category: product.category || 'General',
          isFavorite: false
        }))
        setCards(transformedProducts)
        if (favorites.length > 0) {
          favorites.map(favorite => {
            printFavorite(favorite.id, true)
          })
        }
      } catch (error) {
        console.error('Error fetching products for home:', error)
        // En caso de error, usar productos vacíos
        setCards([])
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (favorites.length > 0) {
      favorites.map(favorite => {
        printFavorite(favorite.id, true)
      })
    } else {
      setCards(prevCards =>
        prevCards.map(card => ({ ...card, isFavorite: false }))
      )
    }
  }, [favorites])

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

  const printFavorite = (id, isFav) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFavorite: isFav } : card
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
      {/* Panel superior */}
      <div className="hero-panel">
        <img src="/imgs/panel.jpeg" alt="Banner de productos frescos" />
      </div>

      {/* Panel deslizable de imágenes */}
      <div className="sliding-panel">
        {sliderImages.map(image => (
          <div className="slide" key={image.id}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>

      <div className="row card-container">
        {cards.map(card => (
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
    </div>
  )
}
