import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ENDPOINT } from '../config/constants'
import { FavoriteContext } from '../context/FavoriteContext.jsx'
import CardDetail from '../components/CardDetail'
import ProductCard from '../components/Card'
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
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(false)
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
      // Obtener productos relacionados después de cargar el producto principal
      await fetchRelatedProducts(productData.categoryId)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener productos relacionados por categoría
  const fetchRelatedProducts = async categoryId => {
    try {
      setLoadingRelated(true)
      const response = await fetch(
        `${ENDPOINT.products}?category=${categoryId}&limits=4`
      )

      if (!response.ok) {
        throw new Error('Error al cargar productos relacionados')
      }

      const data = await response.json()
      // Filtrar el producto actual de los productos relacionados
      // Convertir ambos IDs a string para comparación consistente
      const currentProductId = String(id)
      const filteredProducts =
        data.results?.filter(relatedProduct => {
          const relatedProductId = String(relatedProduct.id)
          const shouldInclude = relatedProductId !== currentProductId
          console.log(
            `Producto actual: ${currentProductId}, Producto relacionado: ${relatedProductId}, Incluir: ${shouldInclude}`
          )
          return shouldInclude
        }) || []

      console.log(
        `Total productos relacionados después del filtro: ${filteredProducts.length}`
      )
      setRelatedProducts(filteredProducts.slice(0, 3)) // Mostrar solo 3 productos
    } catch (err) {
      console.error('Error al cargar productos relacionados:', err.message)
      setRelatedProducts([])
    } finally {
      setLoadingRelated(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

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

  // Funciones para manejar productos relacionados
  const handleRelatedToggleFavorite = async productId => {
    await handleActionFavorite(productId)
    setRelatedProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    )
  }

  const handleRelatedAddToCart = productWithQuantity => {
    const { quantity, ...product } = productWithQuantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const handleRelatedViewDetails = productId => {
    navigate(`/card/${productId}`)
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

      <div className="main-product-section">
        <CardDetail
          product={{
            ...product,
            isFavorite: isProductFavorite(product.id)
          }}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Sección de productos relacionados */}
      <div className="related-products-section">
        <h2 className="related-products-title">
          Productos que podrían gustarte:
        </h2>

        {loadingRelated && (
          <div className="related-loading">
            <p>Cargando productos relacionados...</p>
          </div>
        )}

        {!loadingRelated && relatedProducts.length > 0 && (
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="related-product-item">
                <ProductCard
                  product={{
                    id: String(relatedProduct.id), // Convertir a string para cumplir con PropTypes
                    name: relatedProduct.name || relatedProduct.productname,
                    price: relatedProduct.price,
                    stock: relatedProduct.stock,
                    category: relatedProduct.category,
                    categoryId:
                      relatedProduct.categoryId || relatedProduct.category_id,
                    img: relatedProduct.img,
                    isFavorite: Boolean(
                      favorites.find(fav => fav.id === relatedProduct.id)
                    )
                  }}
                  onAddToCart={handleRelatedAddToCart}
                  onToggleFavorite={handleRelatedToggleFavorite}
                  onViewDetails={handleRelatedViewDetails}
                />
              </div>
            ))}
          </div>
        )}

        {!loadingRelated && relatedProducts.length === 0 && (
          <div className="no-related-products">
            <p>No hay productos relacionados disponibles.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
