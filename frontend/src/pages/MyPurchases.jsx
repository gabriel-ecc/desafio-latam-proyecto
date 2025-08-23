import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import './MyPurchases.css'
import axios from 'axios'

const MyPurchases = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [purchases, setPurchases] = useState([])
  const token = getToken()

  useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

  useEffect(() => {
    const getMyPurchases = async () => {
      try {
        await axios
          .get(ENDPOINT.purchases, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(({ data }) => {
            setPurchases(data)
          })
      } catch (error) {
        console.error('Error fetching purchases:', error)
      }
    }
    getMyPurchases()
  }, [])

  const getStatusBadge = status => {
    const statusConfig = {
      0: {
        className: 'status-cart-cancelled',
        icon: '🛒❌',
        text: 'Carrito Cancelado'
      },
      1: { className: 'status-cart', icon: '🛒', text: 'Carrito' },
      2: { className: 'status-pickup', icon: '🏪', text: 'Retiro en Tienda' },
      3: { className: 'status-delivery', icon: '🚚', text: 'En Delivery' },
      4: { className: 'status-completed', icon: '✅', text: 'Finalizada' },
      5: { className: 'status-cancelled', icon: '❌', text: 'Cancelada' }
    }

    const config = statusConfig[status] || {
      className: 'status-default',
      icon: '?'
    }

    return (
      <span className={`status-badge ${config.className}`}>
        {config.icon} {config.text}
      </span>
    )
  }

  const handleSelectPurchase = async purchase => {
    try {
      const response = await axios.get(
        `${ENDPOINT.purchasesDetail}/${purchase.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setSelectedPurchase({
        orderNumber: purchase.id,
        date: purchase.create_date,
        status: purchase.order_status,
        estimatedDate: purchase.create_date,
        products: response.data.purchasesDetail,
        total: purchase.total_amount
      })
    } catch (error) {
      console.error('Error fetching purchase details:', error)
    }
  }

  const renderPurchaseDetails = purchase => {
    if (!purchase) return null

    return (
      <div className="order_details_inline">
        <div className="order_summary">
          <h3>Orden #{purchase.orderNumber}</h3>
          <div className="order_info">
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(purchase.date).toISOString().slice(0, 10)}
            </p>
            <p>
              <strong>Estado:</strong> {getStatusBadge(purchase.order_status)}
            </p>
            <p>
              <strong>Estimación:</strong>{' '}
              {new Date(purchase.estimatedDate).toISOString().slice(0, 10)}
            </p>
          </div>
        </div>

        <div className="products_detail">
          <h4>Productos:</h4>
          {purchase.products.map(product => (
            <div key={product.id} className="product_detail_item">
              <div className="product_img_section">
                <img
                  className="product_detail_img"
                  src={product.img}
                  alt={product.name}
                  onError={e => {
                    e.target.src = '/imgs/placeholder.jpg'
                  }}
                />
                <h5>{product.name}</h5>
              </div>
              <div className="product_price_info">
                <span className="price">
                  Precio: ${product.price.toLocaleString('es-CL')}
                </span>
                <span className="quantity">Cantidad: {product.quantity}</span>
                <span className="subtotal">
                  Subtotal: $
                  {(product.price * product.quantity).toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="order_total">
          <div className="total_summary">
            <p>
              Total de artículos:{' '}
              {purchase.products.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <h3 className="final_total">
              Total Final: ${purchase.total.toLocaleString('es-CL')}
            </h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <BackButton />
      <main className="big_container_purchases">
        <div className="section_left">
          <div className="purchases">
            <h2>Mis Pedidos</h2>
            {purchases.length === 0 ? (
              <p>No tienes compras realizadas.</p>
            ) : (
              purchases.map(purchase => (
                <div key={purchase.id}>
                  <button
                    className={`purchase_item ${selectedPurchase?.id === purchase.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPurchase(purchase)}
                    aria-label={`Seleccionar pedido ${purchase.id}`}
                  >
                    <div className="purchase_header">
                      <div className="purchase_info">
                        <h4>Orden: {purchase.id}</h4>
                        <p className="purchase_date">
                          Fecha de compra:{' '}
                          {new Date(purchase.create_date)
                            .toISOString()
                            .slice(0, 10)}
                        </p>
                        <p className="purchase_total">
                          Total: $
                          {purchase.total_amount > 0
                            ? purchase.total_amount.toLocaleString('es-CL')
                            : 0}
                        </p>
                      </div>
                      <div className="purchase_status">
                        {getStatusBadge(purchase.order_status)}
                      </div>
                    </div>
                    <div className="purchase_details">
                      <p className="estimated_date">
                        {new Date(purchase.create_date)
                          .toISOString()
                          .slice(0, 10)}
                      </p>
                      <span className="btn_details">Ver detalle</span>
                    </div>
                  </button>

                  {/* Detalles inline para móviles/tablets */}
                  {selectedPurchase?.id === purchase.id && (
                    <div className="mobile_details">
                      {renderPurchaseDetails(purchase)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="section_right">
          <h2>Detalles del Pedido:</h2>
          <div className="order_details_container">
            {!selectedPurchase ? (
              <div className="no_selection">
                <p>Selecciona una compra para ver los detalles</p>
                <i className="fas fa-shopping-bag fa-3x"></i>
              </div>
            ) : (
              <>
                <div className="order_summary">
                  <h3>Orden #{selectedPurchase.orderNumber}</h3>
                  <div className="order_info">
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {new Date(selectedPurchase.date)
                        .toISOString()
                        .slice(0, 10)}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      {getStatusBadge(selectedPurchase.status)}
                    </p>
                    <p>
                      <strong>Estimación:</strong>{' '}
                      {new Date(selectedPurchase.estimatedDate)
                        .toISOString()
                        .slice(0, 10)}
                    </p>
                  </div>
                </div>

                <div className="products_detail">
                  <h4>Productos:</h4>
                  {selectedPurchase.products.map(product => (
                    <div key={product.id} className="product_detail_item">
                      <div className="product_img_section">
                        <img
                          className="product_detail_img"
                          src={product.img}
                          alt={product.name}
                          onError={e => {
                            e.target.src = '/imgs/placeholder.jpg'
                          }}
                        />
                        <h5>{product.name}</h5>
                      </div>
                      <div className="product_price_info">
                        <span className="price">
                          Precio: ${product.price.toLocaleString('es-CL')}
                        </span>
                        <span className="quantity">
                          Cantidad: {product.quantity}
                        </span>
                        <span className="subtotal">
                          Subtotal: $
                          {product.price === 0
                            ? 0
                            : (product.price * product.quantity).toLocaleString(
                                'es-CL'
                              )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order_total">
                  <div className="total_summary">
                    <p>
                      Total de artículos:{' '}
                      {selectedPurchase.products.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </p>
                    <h3 className="final_total">
                      Total Final: $
                      {selectedPurchase.total === 0
                        ? 0
                        : selectedPurchase.total.toLocaleString('es-CL')}
                    </h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default MyPurchases
