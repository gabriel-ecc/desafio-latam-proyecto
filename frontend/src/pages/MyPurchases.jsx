import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { URLBASE } from '../config/constants'
import './MyPurchases.css'

const MyPurchases = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null)

  // Mock data - Datos de ejemplo que reemplazarán cuando esté el backend
  const [purchases] = useState([
    {
      id: 1,
      orderNumber: '75924112',
      date: '04/06/2025',
      status: 'Finalizada',
      total: 5900,
      estimatedDate: 'Pedido entregado',
      products: [
        {
          id: 1,
          name: 'Zapallo Italiano',
          price: 800,
          quantity: 1,
          img: `${URLBASE}/api/v1/uploads/zapalloItaliano.webp`
        },
        {
          id: 2,
          name: 'Zanahoria',
          price: 900,
          quantity: 3,
          img: `${URLBASE}/api/v1/uploads/zanahoria.webp`
        },
        {
          id: 3,
          name: 'Cebolla Morada',
          price: 1200,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/cebollaMorada.jpeg`
        }
      ]
    },
    {
      id: 2,
      orderNumber: '75981804',
      date: '02/06/2025',
      status: 'En delivery',
      total: 2790,
      estimatedDate: 'Tú orden va en camino',
      products: [
        {
          id: 4,
          name: 'Brócoli',
          price: 930,
          quantity: 3,
          img: `${URLBASE}/api/v1/uploads/brocoli.webp`
        }
      ]
    },
    {
      id: 3,
      orderNumber: '75130136',
      date: '16/05/2025',
      status: 'Retiro en tienda',
      total: 5590,
      estimatedDate: 'Listo para retirar en el local',
      products: [
        {
          id: 5,
          name: 'Lechuga Costina',
          price: 1120,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/LechugaCostina.webp`
        },
        {
          id: 6,
          name: 'Tomate Larga Vida',
          price: 1350,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/tomatesLargaVida.jpeg`
        }
      ]
    },
    {
      id: 4,
      orderNumber: '75130135',
      date: '15/05/2025',
      status: 'Preparacion',
      total: 3200,
      estimatedDate: 'Orden en preparación',
      products: [
        {
          id: 7,
          name: 'Palta Hass',
          price: 1600,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/paltaHass.webp`
        }
      ]
    },
    {
      id: 5,
      orderNumber: '75130134',
      date: '14/05/2025',
      status: 'Carrito',
      total: 1800,
      estimatedDate: 'Carrito en preparación',
      products: [
        {
          id: 8,
          name: 'Tomate Cherry',
          price: 900,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/tomatesLargaVida.jpeg`
        }
      ]
    },
    {
      id: 6,
      orderNumber: '75130133',
      date: '13/05/2025',
      status: 'Cancelada',
      total: 2400,
      estimatedDate: 'Pedido cancelado',
      products: [
        {
          id: 9,
          name: 'Lechuga',
          price: 1200,
          quantity: 2,
          img: `${URLBASE}/api/v1/uploads/LechugaCostina.webp`
        }
      ]
    }
  ])

  useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

  const getStatusBadge = status => {
    const statusConfig = {
      Carrito: { className: 'status-cart', icon: '🛒' },
      'Carrito cancelado': { className: 'status-cart-cancelled', icon: '🛒❌' },
      Preparacion: { className: 'status-preparation', icon: '👨‍🍳' },
      'Retiro en tienda': { className: 'status-pickup', icon: '🏪' },
      'En delivery': { className: 'status-delivery', icon: '🚚' },
      Finalizada: { className: 'status-completed', icon: '✅' },
      Cancelada: { className: 'status-cancelled', icon: '❌' }
    }

    const config = statusConfig[status] || {
      className: 'status-default',
      icon: '?'
    }

    return (
      <span className={`status-badge ${config.className}`}>
        {config.icon} {status}
      </span>
    )
  }

  const handleSelectPurchase = purchase => {
    setSelectedPurchase(purchase)
  }

  const renderPurchaseDetails = purchase => {
    if (!purchase) return null

    return (
      <div className="order_details_inline">
        <div className="order_summary">
          <h3>Orden #{purchase.orderNumber}</h3>
          <div className="order_info">
            <p>
              <strong>Fecha:</strong> {purchase.date}
            </p>
            <p>
              <strong>Estado:</strong> {getStatusBadge(purchase.status)}
            </p>
            <p>
              <strong>Estimación:</strong> {purchase.estimatedDate}
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
                    aria-label={`Seleccionar pedido ${purchase.orderNumber}`}
                  >
                    <div className="purchase_header">
                      <div className="purchase_info">
                        <h4>Orden: {purchase.orderNumber}</h4>
                        <p className="purchase_date">
                          Fecha de compra: {purchase.date}
                        </p>
                        <p className="purchase_total">
                          Total: ${purchase.total.toLocaleString('es-CL')}
                        </p>
                      </div>
                      <div className="purchase_status">
                        {getStatusBadge(purchase.status)}
                      </div>
                    </div>
                    <div className="purchase_details">
                      <p className="estimated_date">{purchase.estimatedDate}</p>
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
                      <strong>Fecha:</strong> {selectedPurchase.date}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      {getStatusBadge(selectedPurchase.status)}
                    </p>
                    <p>
                      <strong>Estimación:</strong>{' '}
                      {selectedPurchase.estimatedDate}
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
                          {(product.price * product.quantity).toLocaleString(
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
                      {selectedPurchase.total.toLocaleString('es-CL')}
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
