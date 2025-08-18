import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import './AdminPurchases.css'
import axios from 'axios'
import Swal from 'sweetalert2'

const AdminPurchases = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
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

        await Swal.fire({
          title: 'Error al cargar pedidos',
          html: `
            <div style="text-align: center;">
              <p>No se pudieron cargar los pedidos de la base de datos</p>
              <div style="margin: 15px 0; padding: 15px; background-color: #fee; border-radius: 10px; border-left: 4px solid #e74c3c;">
                <p style="margin: 0; color: #c0392b;">
                  ${error.response?.data?.message || 'Error interno del servidor'}
                </p>
              </div>
              <small style="color: #666;">Verifica tu conexión o contacta al administrador</small>
            </div>
          `,
          icon: 'error',
          confirmButtonColor: '#e74c3c',
          confirmButtonText: 'Entendido'
        })
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

      console.log('Response data:', response.data) // Debug log
      console.log('Products detail:', response.data.purchasesDetail) // Debug log
      console.log('Purchase delivery_type from API:', purchase.delivery_type); // Debug log

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
      setShowProducts(false) // Reset products view
    } catch (error) {
      console.error('Error fetching purchase details:', error)

      await Swal.fire({
        title: 'Error al cargar detalles',
        html: `
          <div style="text-align: center;">
            <p>No se pudieron cargar los detalles del pedido <strong>#${purchase.id}</strong></p>
            <div style="margin: 15px 0; padding: 15px; background-color: #fee; border-radius: 10px; border-left: 4px solid #e74c3c;">
              <p style="margin: 0; color: #c0392b;">
                ${error.response?.data?.message || 'Error interno del servidor'}
              </p>
            </div>
            <small style="color: #666;">Por favor, intenta nuevamente</small>
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Entendido'
      })
    }
  }

  const handleShowProducts = async purchase => {
    try {
      const response = await axios.get(
        `${ENDPOINT.adminPurchasesDetail}/${purchase.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      console.log('handleShowProducts - Purchase delivery_type from API:', purchase.delivery_type); // Debug log

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
      setShowProducts(true) // Show only products view
    } catch (error) {
      console.error('Error fetching purchase details:', error)

      await Swal.fire({
        title: 'Error al cargar productos',
        html: `
          <div style="text-align: center;">
            <p>No se pudieron cargar los productos del pedido <strong>#${purchase.id}</strong></p>
            <div style="margin: 15px 0; padding: 15px; background-color: #fee; border-radius: 10px; border-left: 4px solid #e74c3c;">
              <p style="margin: 0; color: #c0392b;">
                ${error.response?.data?.message || 'Error interno del servidor'}
              </p>
            </div>
            <small style="color: #666;">Por favor, intenta nuevamente</small>
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Entendido'
      })
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    // Obtener información del estado
    const statusInfo = {
      1: { name: 'Carrito', icon: '🛒', color: '#3498db' },
      2: { name: 'Retiro en Tienda', icon: '🏪', color: '#f39c12' },
      3: { name: 'En Delivery', icon: '🚚', color: '#9b59b6' },
      4: { name: 'Finalizada', icon: '✅', color: '#27ae60' },
      5: { name: 'Cancelada', icon: '❌', color: '#e74c3c' }
    }

    const newStatusInfo = statusInfo[newStatus]

    // Confirmación antes de cambiar el estado
    const result = await Swal.fire({
      title: '¿Confirmar cambio de estado?',
      html: `
        <div style="text-align: center;">
          <p>¿Estás seguro que deseas cambiar el estado del pedido <strong>#${orderId}</strong> a:</p>
          <div style="margin: 20px 0; padding: 15px; background-color: ${newStatusInfo.color}15; border-radius: 10px; border-left: 4px solid ${newStatusInfo.color};">
            <span style="font-size: 24px;">${newStatusInfo.icon}</span>
            <p style="margin: 5px 0; font-weight: bold; color: ${newStatusInfo.color};">${newStatusInfo.name}</p>
          </div>
          <small style="color: #666;">Esta acción no se puede deshacer</small>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatusInfo.color,
      cancelButtonColor: '#95a5a6',
      confirmButtonText: `Sí, cambiar a ${newStatusInfo.name}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true
    })

    if (!result.isConfirmed) {
      return
    }

    setIsUpdating(true)

    // Mostrar loading
    Swal.fire({
      title: 'Actualizando estado...',
      html: `
        <div style="text-align: center;">
          <div style="margin: 20px 0;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>
          <p>Procesando cambio de estado del pedido #${orderId}</p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

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

      // Éxito
      await Swal.fire({
        title: '¡Estado actualizado!',
        html: `
          <div style="text-align: center;">
            <div style="margin: 20px 0; padding: 20px; background-color: ${newStatusInfo.color}15; border-radius: 15px;">
              <span style="font-size: 48px; margin-bottom: 10px; display: block;">${newStatusInfo.icon}</span>
              <p style="margin: 10px 0; font-size: 18px;">El pedido <strong>#${orderId}</strong> ahora está en estado:</p>
              <p style="margin: 0; font-weight: bold; color: ${newStatusInfo.color}; font-size: 20px;">${newStatusInfo.name}</p>
            </div>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: newStatusInfo.color,
        confirmButtonText: 'Entendido',
        timer: 5000,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Error updating order status:', error)

      // Error
      await Swal.fire({
        title: 'Error al actualizar',
        html: `
          <div style="text-align: center;">
            <p>No se pudo actualizar el estado del pedido <strong>#${orderId}</strong></p>
            <div style="margin: 15px 0; padding: 15px; background-color: #fee; border-radius: 10px; border-left: 4px solid #e74c3c;">
              <p style="margin: 0; color: #c0392b;">
                ${error.response?.data?.message || 'Error interno del servidor'}
              </p>
            </div>
            <small style="color: #666;">Por favor, intenta nuevamente o contacta al administrador</small>
          </div>
        `,
        icon: 'error',
        confirmButtonColor: '#e74c3c',
        confirmButtonText: 'Entendido'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusOptions = (currentStatus, deliveryType) => {
    console.log('getStatusOptions called with:', { currentStatus, deliveryType }); // Debug log
    
    const allStatuses = [
      { value: 1, label: 'Carrito' },
      { value: 2, label: 'Retiro en Tienda' },
      { value: 3, label: 'En Delivery' },
      { value: 5, label: 'Cancelada' },
      { value: 4, label: 'Finalizada' }
    ]

    // Filtrar opciones según el estado actual y tipo de entrega
    const filteredOptions = allStatuses.filter(status => {
      if (currentStatus === 4 || currentStatus === 5) {
        // Si está finalizada o cancelada, no se puede cambiar
        return false
      }
      
      // Si es retiro en tienda (2), no permitir "En Delivery"
      if (deliveryType === 2 && status.value === 3) {
        console.log('Filtering out "En Delivery" for pickup order'); // Debug log
        return false
      }
      
      // Si es delivery (1), no permitir "Retiro en Tienda"
      if (deliveryType === 1 && status.value === 2) {
        console.log('Filtering out "Retiro en Tienda" for delivery order'); // Debug log
        return false
      }
      
      return status.value !== currentStatus
    })
    
    console.log('Filtered options:', filteredOptions); // Debug log
    return filteredOptions
  }

  const renderPurchaseDetails = purchase => {
    if (!purchase) return null

    // Si showProducts es true, mostrar solo los productos
    if (showProducts) {
      return (
        <div className="order_details_inline">
          <div className="order_summary">
            <h3>Productos - Orden #{purchase.orderNumber}</h3>
            <div className="order_info">
              <p>
                <strong>Cliente:</strong> {purchase.userInfo.name}
              </p>
              <p>
                <strong>Total de artículos:</strong>{' '}
                {purchase.products.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </p>
              <p>
                <strong>Total Final:</strong> $
                {purchase.total === 0
                  ? 0
                  : purchase.total.toLocaleString('es-CL')}
              </p>
            </div>
          </div>

          <div className="products_detail">
            <h4>Lista de Productos:</h4>
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

          <div className="products_actions">
            <button
              className="btn_back_to_details"
              onClick={() => setShowProducts(false)}
            >
              ← Volver a Detalles Completos
            </button>
          </div>
        </div>
      )
    }

    // Vista completa de detalles (por defecto)
    return (
      <div className="order_details_inline">
        <div className="order_summary">
          <h3>Orden #{purchase.orderNumber}</h3>
          <div className="order_info">
            <p>
              <strong>Cliente:</strong> {purchase.userInfo.name} (
              {purchase.userInfo.email})
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {new Date(purchase.date).toISOString().slice(0, 10)}
            </p>
            <p>
              <strong>Estado:</strong> {getStatusBadge(purchase.status)}
            </p>
            <p>
              <strong>Tipo de entrega:</strong>{' '}
              {purchase.deliveryType === 2
                ? 'Retiro en tienda'
                : 'Delivery'}
            </p>
            {purchase.deliveryType !== 2 && purchase.shippingAddress && (
              <p>
                <strong>Dirección:</strong> {purchase.shippingAddress}
              </p>
            )}
            {purchase.deliveryType !== 2 && purchase.recipientName && (
              <p>
                <strong>Destinatario:</strong> {purchase.recipientName}
              </p>
            )}
          </div>
        </div>

        {/* Sección para actualizar estado */}
        <div className="status_update_section">
          <h4>Cambiar Estado del Pedido:</h4>
          <div className="status_buttons">
            {getStatusOptions(purchase.status, purchase.deliveryType).map(statusOption => (
              <button
                key={statusOption.value}
                className="status_update_btn"
                onClick={() =>
                  updateOrderStatus(purchase.orderNumber, statusOption.value)
                }
                disabled={isUpdating}
              >
                {isUpdating
                  ? 'Actualizando...'
                  : `Cambiar a: ${statusOption.label}`}
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
            <p className="admin-subtitle">
              Historial completo de pedidos de todos los clientes
            </p>
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
                          Fecha:{' '}
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
                      <div className="purchase_buttons">
                        <span
                          className="btn_details"
                          onClick={e => {
                            e.stopPropagation()
                            handleSelectPurchase(purchase)
                          }}
                        >
                          Ver detalle
                        </span>
                        <span
                          className="btn_products"
                          onClick={e => {
                            e.stopPropagation()
                            handleShowProducts(purchase)
                          }}
                        >
                          Productos
                        </span>
                      </div>
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
            ) : showProducts ? (
              // Vista solo de productos
              <>
                <div className="order_summary">
                  <h3>Productos - Orden #{selectedPurchase.orderNumber}</h3>
                  <div className="order_info">
                    <p>
                      <strong>Cliente:</strong> {selectedPurchase.userInfo.name}
                    </p>
                    <p>
                      <strong>Total de artículos:</strong>{' '}
                      {selectedPurchase.products.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                    </p>
                    <p>
                      <strong>Total Final:</strong> $
                      {selectedPurchase.total === 0
                        ? 0
                        : selectedPurchase.total.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>

                <div className="products_detail">
                  <h4>Lista de Productos:</h4>
                  {console.log(
                    'Rendering products:',
                    selectedPurchase.products
                  )}
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

                <div className="products_actions">
                  <button
                    className="btn_back_to_details"
                    onClick={() => setShowProducts(false)}
                  >
                    ← Volver a Detalles Completos
                  </button>
                </div>
              </>
            ) : (
              // Vista completa de detalles
              <>
                <div className="order_summary">
                  <h3>Orden #{selectedPurchase.orderNumber}</h3>
                  <div className="order_info">
                    <p>
                      <strong>Cliente:</strong> {selectedPurchase.userInfo.name}{' '}
                      ({selectedPurchase.userInfo.email})
                    </p>
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
                      <strong>Tipo de entrega:</strong>{' '}
                      {selectedPurchase.deliveryType === 2
                        ? 'Retiro en tienda'
                        : 'Delivery'}
                    </p>
                    {(() => {
                      console.log('Checking delivery type for address/recipient:', selectedPurchase.deliveryType); // Debug log
                      return null;
                    })()}
                    {selectedPurchase.deliveryType !== 2 && selectedPurchase.shippingAddress && (
                      <p>
                        <strong>Dirección:</strong>{' '}
                        {selectedPurchase.shippingAddress}
                      </p>
                    )}
                    {selectedPurchase.deliveryType !== 2 && selectedPurchase.recipientName && (
                      <p>
                        <strong>Destinatario:</strong>{' '}
                        {selectedPurchase.recipientName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sección para actualizar estado */}
                <div className="status_update_section">
                  <h4>Cambiar Estado del Pedido:</h4>
                  <div className="status_buttons">
                    {(() => {
                      console.log('selectedPurchase before getStatusOptions:', selectedPurchase); // Debug log
                      return getStatusOptions(selectedPurchase.status, selectedPurchase.deliveryType);
                    })().map(
                      statusOption => (
                        <button
                          key={statusOption.value}
                          className="status_update_btn"
                          onClick={() =>
                            updateOrderStatus(
                              selectedPurchase.orderNumber,
                              statusOption.value
                            )
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? 'Actualizando...'
                            : `${statusOption.label}`}
                        </button>
                      )
                    )}
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
