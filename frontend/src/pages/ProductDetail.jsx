import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constants'
import CardDetail from '../components/CardDetail'
import useCart from '../context/CartContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para obtener el producto
  const fetchProduct = async () => {
    try {
      setLoading(true)
      console.log('Fetching product with ID:', id)
      console.log('Fetching from URL:', `${ENDPOINT.products}/${id}`)
      const response = await fetch(`${ENDPOINT.products}/${id}`)

      if (!response.ok) {
        throw new Error('Error al cargar el producto')
      }

      const productData = await response.json()
      console.log('Product data received:', productData)
      setProduct(productData)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  // Gestión simple de favoritos con localStorage
  const getFavorites = () => {
    const favorites = localStorage.getItem('favorites')
    return favorites ? JSON.parse(favorites) : []
  }

  const isProductFavorite = productId => {
    return getFavorites().includes(productId)
  }

  const handleToggleFavorite = productId => {
    const favorites = getFavorites()
    const isFavorite = favorites.includes(productId)

    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== productId)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      const newFavorites = [...favorites, productId]
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }

    // Actualizar el producto con el nuevo estado de favorito
    setProduct(prevProduct => ({
      ...prevProduct,
      isFavorite: !isFavorite
    }))
  }

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity)
  }

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/catalog')} className="btn-primary">
            Volver al catálogo
          </button>
          <button onClick={fetchProduct} className="btn-secondary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error">
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate('/catalog')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <button
        onClick={() => navigate(-1)}
        className="btn-back"
        aria-label="Volver"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Volver
      </button>

      <CardDetail
        product={{
          ...product,
          isFavorite: isProductFavorite(product.id)
        }}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  )
}

export default ProductDetail
