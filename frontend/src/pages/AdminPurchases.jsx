import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import './AdminPurchases.css'
import axios from 'axios'

const AdminPurchases = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const token = getToken()

  useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

  useEffect(() => {
    const getAllPurchases = async () => {
      try {
        const response = await axios.get(ENDPOINT.adminPurchases, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPurchases(response.data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
      }
    }
    getAllPurchases()
  }, [token])

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
      icon: '?',
      text: 'Desconocido'
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
        `${ENDPOINT.adminPurchasesDetail}/${purchase.id}`,
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
        total: purchase.total_amount,
        userInfo: {
          name: purchase.user_name,
          email: purchase.user_email
        },
        deliveryType: purchase.delivery_type,
        shippingAddress: purchase.shipping_address,
        recipientName: purchase.recipient_name
      })
    } catch (error) {
      console.error('Error fetching purchase details:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setIsUpdating(true)
    try {
      await axios.put(
        `${ENDPOINT.updateOrderStatus}/${orderId}/status`,
        { order_status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Actualizar la lista de compras
      const response = await axios.get(ENDPOINT.adminPurchases, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPurchases(response.data)

      // Actualizar la compra seleccionada si es la misma
      if (selectedPurchase && selectedPurchase.orderNumber === orderId) {
        setSelectedPurchase(prev => ({
          ...prev,
          status: newStatus
        }))
      }

      alert('Estado del pedido actualizado exitosamente')
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error al actualizar el estado del pedido')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusOptions = currentStatus => {
    const allStatuses = [
      { value: 1, label: 'Carrito' },
      { value: 2, label: 'Retiro en Tienda' },
      { value: 3, label: 'En Delivery' },
      { value: 4, label: 'Finalizada' },
      { value: 5, label: 'Cancelada' }
    ]

    // Filtrar opciones según el estado actual
    return allStatuses.filter(status => {
      if (currentStatus === 4 || currentStatus === 5) {
        // Si está finalizada o cancelada, no se puede cambiar
        return false
      }
      return status.value !== currentStatus
    })
  }

  const renderPurchaseDetails = purchase => {
    if (!purchase) return null

    return (
      <div className="order_details_inline">
        <div className="order_summary">
          <h3>Orden #{purchase.orderNumber}</h3>
          <div className="order_info">
            <p>
              <strong>Cliente:</strong> {purchase.userInfo.name} ({purchase.userInfo.email})
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(purchase.date).toISOString().slice(0, 10)}
            </p>
            <p>
              <strong>Estado:</strong> {getStatusBadge(purchase.status)}
            </p>
            <p>
              <strong>Tipo de entrega:</strong> {purchase.deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}
            </p>
            {purchase.shippingAddress && (
              <p>
                <strong>Dirección:</strong> {purchase.shippingAddress}
              </p>
            )}
            {purchase.recipientName && (
              <p>
                <strong>Destinatario:</strong> {purchase.recipientName}
              </p>
            )}
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

        {/* Sección para actualizar estado */}
        <div className="status_update_section">
          <h4>Cambiar Estado del Pedido:</h4>
          <div className="status_buttons">
            {getStatusOptions(purchase.status).map(statusOption => (
              <button
                key={statusOption.value}
                className="status_update_btn"
                onClick={() => updateOrderStatus(purchase.orderNumber, statusOption.value)}
                disabled={isUpdating}
              >
                {isUpdating ? 'Actualizando...' : `Cambiar a: ${statusOption.label}`}
              </button>
            ))}
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
            <h2>Gestión de Pedidos</h2>
            <p className="admin-subtitle">Historial completo de pedidos de todos los clientes</p>
            {purchases.length === 0 ? (
              <p>No hay pedidos registrados.</p>
            ) : (
              purchases.map(purchase => (
                <div key={purchase.id}>
                  <button
                    className={`purchase_item ${selectedPurchase?.orderNumber === purchase.id ? 'selected' : ''}`}
                    onClick={() => handleSelectPurchase(purchase)}
                    aria-label={`Seleccionar pedido ${purchase.id}`}
                  >
                    <div className="purchase_header">
                      <div className="purchase_info">
                        <h4>Orden: {purchase.id}</h4>
                        <p className="purchase_client">
                          Cliente: {purchase.user_name}
                        </p>
                        <p className="purchase_date">
                          Fecha: {new Date(purchase.create_date).toISOString().slice(0, 10)}
                        </p>
                        <p className="purchase_total">
                          Total: ${purchase.total_amount > 0 ? purchase.total_amount.toLocaleString('es-CL') : 0}
                        </p>
                      </div>
                      <div className="purchase_status">
                        {getStatusBadge(purchase.order_status)}
                      </div>
                    </div>
                    <div className="purchase_details">
                      <p className="estimated_date">
                        {new Date(purchase.create_date).toISOString().slice(0, 10)}
                      </p>
                      <span className="btn_details">Ver detalle</span>
                    </div>
                  </button>

                  {/* Detalles inline para móviles/tablets */}
                  {selectedPurchase?.orderNumber === purchase.id && (
                    <div className="mobile_details">
                      {renderPurchaseDetails(selectedPurchase)}
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
                <p>Selecciona un pedido para ver los detalles</p>
                <i className="fas fa-shopping-bag fa-3x"></i>
              </div>
            ) : (
              <>
                <div className="order_summary">
                  <h3>Orden #{selectedPurchase.orderNumber}</h3>
                  <div className="order_info">
                    <p>
                      <strong>Cliente:</strong> {selectedPurchase.userInfo.name} ({selectedPurchase.userInfo.email})
                    </p>
                    <p>
                      <strong>Fecha:</strong>{' '}
                      {new Date(selectedPurchase.date).toISOString().slice(0, 10)}
                    </p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      {getStatusBadge(selectedPurchase.status)}
                    </p>
                    <p>
                      <strong>Tipo de entrega:</strong> {selectedPurchase.deliveryType === 'pickup' ? 'Retiro en tienda' : 'Delivery'}
                    </p>
                    {selectedPurchase.shippingAddress && (
                      <p>
                        <strong>Dirección:</strong> {selectedPurchase.shippingAddress}
                      </p>
                    )}
                    {selectedPurchase.recipientName && (
                      <p>
                        <strong>Destinatario:</strong> {selectedPurchase.recipientName}
                      </p>
                    )}
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
                            : (product.price * product.quantity).toLocaleString('es-CL')}
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

                {/* Sección para actualizar estado */}
                <div className="status_update_section">
                  <h4>Cambiar Estado del Pedido:</h4>
                  <div className="status_buttons">
                    {getStatusOptions(selectedPurchase.status).map(statusOption => (
                      <button
                        key={statusOption.value}
                        className="status_update_btn"
                        onClick={() => updateOrderStatus(selectedPurchase.orderNumber, statusOption.value)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Actualizando...' : `Cambiar a: ${statusOption.label}`}
                      </button>
                    ))}
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

export default AdminPurchases
