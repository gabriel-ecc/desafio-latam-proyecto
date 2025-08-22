// Página de inicio. Muestra la bienvenida, productos destacados e información general.
import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../pages/Home.css'
import '../components/Card.css'
import ProductCard from '../components/Card'
import SearchBar from '../components/SearchBar'
import useCart from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import { toast } from '../utils/swalHelper.js'

export default function Home() {
  const [cards, setCards] = useState([])
  const [allProducts, setAllProducts] = useState([]) // Para búsquedas
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const { favorites, handleActionFavorite } = useContext(FavoriteContext)

  // Imágenes del carrusel de categorías
  const categoryImages = [
    { id: 1, src: '/imgs/frutas-gata.jpg', alt: 'Frutas', title: 'Frutas' },
    {
      id: 2,
      src: '/imgs/verduras-gata.jpg',
      alt: 'Verduras',
      title: 'Verduras'
    },
    {
      id: 3,
      src: '/imgs/legumbre-gata.jpg',
      alt: 'Legumbres',
      title: 'Legumbres'
    },
    { id: 4, src: '/imgs/carnes-gata.jpeg', alt: 'Carnes', title: 'Carnes' }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  // Efecto para el carrusel automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % categoryImages.length)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [categoryImages.length])

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
        // Cargar productos para mostrar en el home
        const response = await axios.get(ENDPOINT.productsFrontPage, {
          params: { limits: 6 } // Mostrar solo X productos en el home
        })
        const transformedProducts = response.data.results.map(product => ({
          ...product,
          category: product.category || 'General',
          isFavorite: false
        }))
        setCards(transformedProducts)

        // Cargar todos los productos para la búsqueda
        const allProductsResponse = await axios.get(ENDPOINT.products, {
          params: { limits: 1000 } // Obtener muchos productos para la búsqueda
        })
        const allTransformedProducts = allProductsResponse.data.results.map(
          product => ({
            ...product,
            category: product.category || 'General',
            isFavorite: false
          })
        )
        setAllProducts(allTransformedProducts)
      } catch (error) {
        console.error('Error fetching products for home:', error)
        // En caso de error, usar productos vacíos
        setCards([])
        setAllProducts([])
      }
    }

    fetchProducts()
  }, []) // ← Quitar 'favorites' de las dependencias

  // Sincronizar favoritos cuando cambien
  useEffect(() => {
    if (cards.length > 0) {
      setCards(prevCards =>
        prevCards.map(card => ({
          ...card,
          isFavorite: favorites.some(fav => fav.id === card.id)
        }))
      )
    }

    // También sincronizar allProducts para el SearchBar
    if (allProducts.length > 0) {
      setAllProducts(prevProducts =>
        prevProducts.map(product => ({
          ...product,
          isFavorite: favorites.some(fav => fav.id === product.id)
        }))
      )
    }
  }, [favorites, cards.length, allProducts.length])

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

  // Función para manejar selección directa de producto desde SearchBar
  const handleProductSelect = product => {
    navigate(`/card/${product.id}`)
  }

  return (
    <div className="container">
      {/* Panel superior */}
      <div className="hero-panel">
        <img src="/imgs/panel-gata.png" alt="Banner de productos frescos" />
      </div>
      {/* Barra de búsqueda */}
      <div className="search-container-home">
        <SearchBar
          products={allProducts}
          onProductSelect={handleProductSelect}
          placeholder="Buscar por producto, categoría o temporada..."
          className="home-search"
        />
      </div>
      {/* Carrusel de categorías */}
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 25}%)` }}
          >
            {categoryImages.map(category => (
              <div className="carousel-slide" key={category.id}>
                <div className="category-card">
                  <img src={category.src} alt={category.alt} />
                  <div className="category-title">
                    <h3>{category.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            <div className="carousel-indicators-wrapper">
              {categoryImages.map((category, index) => (
                <button
                  key={`indicator-${category.id}`}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Servicios y Beneficios */}
      <div className="services-section">
        <div className="services-container">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🌱</div>
              <h3>Productos Frescos</h3>
              <p>Directo del campo a tu mesa con la máxima calidad</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚚</div>
              <h3>Envío a Domicilio</h3>
              <p>Entregamos tus productos frescos directamente en tu hogar</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⏰</div>
              <h3>Entrega Rápida</h3>
              <p>Recibe tus productos en el mismo día o al día siguiente</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💳</div>
              <h3>Pago Seguro</h3>
              <p>Múltiples formas de pago seguras y confiables</p>
            </div>
          </div>
        </div>
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
