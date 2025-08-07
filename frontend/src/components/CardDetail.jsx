import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './CardDetail.css'
import FavoriteButton from './FavoriteButton'
import { toast } from '../utils/swalHelper'

const CardDetail = ({ product, onAddToCart, onToggleFavorite }) => {
  const [quantity, setQuantity] = useState(0)

  // Construir la URL completa de la imagen
  const imageUrl = product.img
  //   ? `${URLBASE}/${product.img}`
  //   : '/imgs/placeholder.jpg'

  const handleIncrease = () => {
    setQuantity(prev => (prev + 1 > product.stock ? product.stock : prev + 1))
  }

  const handleDecrease = () => {
    setQuantity(prev => (prev - 1 >= 0 ? prev - 1 : 0))
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)

    toast({
      icon: 'success',
      title: `Has agregado ${quantity} ${product.name} al carrito.`
    })
    setQuantity(0)
  }

  return (
    <div className="card-detail">
      <div className="card-detail-image-container">
        <FavoriteButton
          isFavorite={product.isFavorite}
          onClick={() => onToggleFavorite(product.id)}
        />
        <img src={imageUrl} alt={product.name} className="card-detail-image" />
      </div>

      <div className="card-detail-content">
        <div className="card-detail-header">
          <div className="card-detail-categories">
            <Link to={`/products?category=${product.categoryId}`}>
              <span className="category-tag">{product.category}</span>
            </Link>
            <Link to={`/products?season=${product.seasonId}`}>
              <span className="season-tag">{product.season}</span>
            </Link>
          </div>
          <h1 className="card-detail-title">{product.name}</h1>
        </div>

        <div className="card-detail-pricing">
          <span className="card-detail-price">
            ${product.price.toLocaleString('es-CL')}
          </span>
          <span className="card-detail-stock">
            Stock disponible: <strong>{product.stock}</strong> unidades
          </span>
        </div>

        <div className="card-detail-description">
          <h3>Descripción</h3>
          <p>
            {product.description ||
              'No hay descripción disponible para este producto.'}
          </p>
        </div>

        <div className="card-detail-actions">
          <div className="quantity-selector">
            <label htmlFor="quantity">Cantidad:</label>
            <div className="quantity-control">
              <button
                onClick={handleDecrease}
                disabled={quantity <= 0}
                className="btn-quantity"
              >
                <i className="fa-solid fa-minus"></i>
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(product.stock, parseInt(e.target.value) || 1)
                    )
                  )
                }
                className="quantity-input"
              />
              <button
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="btn-quantity"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-add-to-cart"
          >
            <i className="fa-solid fa-cart-plus"></i>
            {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  )
}

CardDetail.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    season: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    img: PropTypes.string,
    description: PropTypes.string,
    isFavorite: PropTypes.bool
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
}

export default CardDetail
