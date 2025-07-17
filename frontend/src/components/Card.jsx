// Tarjeta visual para mostrar información de un producto.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Card.css' // Se importa el CSS para la tarjeta de producto
import FavoriteButton from './FavoriteButton'
import { URLBASE } from '../config/constants'

const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
}) => {
  // Desestructuramos las propiedades del producto para un uso más limpio
  const { id, name, price, category, img, isFavorite, stock } = product
  // Estado local para manejar la cantidad del producto
  const [quantity, setQuantity] = useState(0)
  const [imgError, setImgError] = useState(false)

  const handleIncrease = () => {
    setQuantity((prev) => (prev + 1 > stock ? stock : prev + 1))
  }

  const handleDecrease = () => {
    // Evita que la cantidad sea menor que 1
    setQuantity((prev) => (prev - 1 > 0 ? prev - 1 : 0))
  }

  const handleAddToCart = () => {
    // Llama a la función pasada por props, añadiendo la cantidad seleccionada
    onAddToCart({ ...product, quantity })
    setQuantity(0)
  }

  const handleDetailsClick = (e) => {
    // Evita que el click se propague a elementos padres si es necesario
    e.stopPropagation()
    if (onViewDetails) onViewDetails(id)
  }

  const handleImageError = () => {
    setImgError(true)
  }

  return (
    <div className="product-card">
      <div className="image-container">
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => onToggleFavorite(id)}
        />
        <img
          // src={imgError ? '/imgs/placeholder.svg' : img}
          src={img}
          alt={name}
          className="product-img"
          onClick={handleDetailsClick}
          onError={handleImageError}
          style={{ cursor: onViewDetails ? 'pointer' : 'default' }}
        />
      </div>
      <div className="product-body">
        <Link to={`/category/${category}`}>
          <span className="product-category">{category}</span>
        </Link>
        <h2
          className="product-title"
          onClick={handleDetailsClick}
          style={{ cursor: onViewDetails ? 'pointer' : 'default' }}
        >
          {name}
        </h2>
        <span className="price">${price.toLocaleString('es-cl')}</span>
        <span className="stock">
          Stock Disponible: {stock.toLocaleString('es-cl')}
        </span>
        <div className="product-actions">
          <div className="quantity-control">
            <button
              className="btn-round btn-qty"
              aria-label="Restar"
              onClick={handleDecrease}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="btn-round btn-qty"
              aria-label="Sumar"
              onClick={handleIncrease}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          <button
            className="btn-round btn-cart"
            aria-label="Agregar al carrito"
            onClick={handleAddToCart}
            disabled={quantity === 0}
          >
            <i className="fa-solid fa-basket-shopping"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func,
}

export default ProductCard
