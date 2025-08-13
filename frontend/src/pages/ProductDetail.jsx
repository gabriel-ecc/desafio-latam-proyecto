import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constants'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import CardDetail from '../components/CardDetail'
import useCart from '../context/CartContext'
import BackButton from '../components/BackButton'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { favorites, handleActionFavorite } = useContext(FavoriteContext)

  // Función para obtener el producto
  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${ENDPOINT.products}/${id}`)

      if (!response.ok) {
        throw new Error('Error al cargar el producto')
      }

      const productData = await response.json()

      setProduct(productData)
    } catch (err) {
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

  const isProductFavorite = productId => {
    return favorites.find(favorite => favorite.id === productId)
  }

  const handleToggleFavorite = async productId => {
    await handleActionFavorite(productId)
    const isFavorite = favorites.find(favorite => favorite.id === productId)
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
          <button onClick={() => navigate('/products')} className="btn-primary">
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
          <button onClick={() => navigate('/products')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-container">
      <BackButton />

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
