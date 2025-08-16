import { CartContext } from '../context/CartContext.jsx'
import { URLBASE, apiVersion } from "../config/constants.js"
import { UserContext } from '../context/UserContext.jsx'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import '../pages/Cart.css'
import { toast } from '../utils/swalHelper'
import Swal from 'sweetalert2'
import BackButton from '../components/BackButton'

const Cart = () => {
  const { cart, setCart, updateQuantity, subtraction, totalPrice, addToCart } =
    useContext(CartContext)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentStep, setPaymentStep] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const navigate = useNavigate()
  const { user, token } = useContext(UserContext)

  {/*Requerimientos para el Pago*/}

  const [nombreTitular, setNombreTitular] = useState('')
  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [expiracion, setExpiracion] = useState('')
  const [cvv, setCvv] = useState('')

  {/*Datos de entrega*/}

  const [nombreDestinatario, setNombreDestinatario] = useState('')
  const [direccionEntrega, setDireccionEntrega] = useState('')
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false)

  const paymentMethods = [
    { id: 'credito', label: 'Crédito', img: '/imgs/credit_card.png' },
    { id: 'debito', label: 'Débito', img: '/imgs/debit_card.png' },
    { id: 'efectivo', label: 'Efectivo', img: '/imgs/cash_payment.png' }
  ]

  useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

 
 {/* Conexión con el backend */}
  const handleEmptyCart = async() => {
    try{
      const response = await axios.get(`${URLBASE}${apiVersion}/cart`,{
        params: { userId: user.id },
        headers: { Authorization: `Bearer ${token}` }
      })
      const cartData = response.data
      const orderId = cartData.id

      await axios.put(`${URLBASE}${apiVersion}/cart`, {
        orderId,
        items: []
      },{
        headers: { Authorization: `Bearer ${token}`}  
      })
      setCart([])
      Swal.fire({
        title: 'Carrito vacío',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745'
      })
      navigate('/')
    }catch(error){
      console.error("Error al vacíar el carrito", error)
    }
  }

  const handlePayEfectivo = async() =>{
    try {
      console.log("USER ID:", user.id);    
      console.log("Cart items:", cart); 
      const payload = {
        user_id: user.id,
        order_status: 2,
        payment_type: 1,
        delivery_type: 2,
        shipping_address: direccionEntrega || 'Calle Falsa 123, Santiago',
        recipient_name: nombreDestinatario || 'Juan Pérez',
        total_amount: Math.round(totalPrice()),
          items: cart.map(item => ({
            product_id:item.id,
            quantity:item.quantity,
            unit_price:Math.round(item.price)
        }))
      }
      console.log("Payload que se enviará:", payload);
      await axios.post(`${URLBASE}${apiVersion}/orders`, payload,{
        headers: { Authorization: `Bearer ${token}`}
      })
      setCart([])
      console.log("Pago en efectivo realizado")
    } catch (error) {
      console.error("Error al pagar:", error)
    }
  }

  const handlePayCard = async() => {
    try {
      const payload = {
        user_id: user.id,
        order_status: 3,
        payment_type: 1,
        delivery_type: 1,
        shipping_address: direccionEntrega,
        recipient_name: nombreDestinatario,
        total_amount: Math.round(totalPrice()),
          items: cart.map(item => ({
            product_id:item.id,
            quantity:item.quantity,
            unit_price:Math.round(item.price)
        }))
      }

    await axios.post(`${URLBASE}${apiVersion}/orders`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    })
    setCart([])
    console.log("Pago con tarjeta realizado")
    } catch (error) {
      console.error("Error al pagar:", error)
    }
  }

 {/*Acción de botones de decisión tanto para la visualización de productos como para Validación de Pago*/}

  const handleCancel = () => {
    Swal.fire({
      title: '¿Seguro que quieres vaciar el carrito?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Vaciar carrito',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed) {
        handleEmptyCart()   
      }
      })
  }

  const handleContinue = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: '¡El Carrito está vacío!',
        icon: 'warning',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745'
      })
      return
    }
    setPaymentStep(true)
  }

  const handleBack = () => {
    setPaymentStep(false)
    setSelectedPayment(null)
    setDeliveryConfirmed(false)
  }

  const handleConfirmDelivery = () => {
    if (!nombreDestinatario.trim() || !direccionEntrega.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa el nombre del destinatario y la dirección.'
      })
      return
    }
    setDeliveryConfirmed(true)
  }

{/*Formatear el número de tarjeta*/}

  const formatCardNumber = value => {
    const onlyNums = value.replace(/\D/g, '')
    const spaced = onlyNums.match(/.{1,4}/g)?.join(' ') || ''
    return spaced
  }

  {/*Formatear la fecha con / de forma automatica*/}

  const formatExpiry = value => {
    const onlyNums = value.replace(/\D/g, '')
    if (onlyNums.length === 0) return ''
    if (onlyNums.length <= 2) return onlyNums
    return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2, 4)
  }

  const handlePay = async () => {
    if (!selectedPayment) {
      Swal.fire({
        icon: 'error',
        title: 'Selecciona un método de pago'
      })
      return
    }

    if (selectedPayment === 'credito' || selectedPayment === 'debito') {
      if (
        !nombreTitular.trim() ||
        !numeroTarjeta.trim() ||
        !expiracion.trim() ||
        !cvv.trim()
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos de la tarjeta.'
        })
        return
      }

    const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiracion)
    const cvvOk = /^\d{3}$/.test(cvv)

    if (!expiryOk || !cvvOk) {
      Swal.fire({
        icon: 'error',
        title: 'Formato inválido',
        text: 'Llenar los campos correctamente'
      })
      return
    }
  }

    {/*Pago éxitoso*/}
    const kindPaymet = selectedPayment === 'efectivo' ? handlePayEfectivo() : handlePayCard()
    
    kindPaymet.then(() => {
    const generateTicketNumber = () => 
      Math.floor(Math.random() * 900000) + 100000
    // Reemplazar después por el futuro order_id en el backend
    const currentDate = new Date()
    const formatDate = date => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    const formatTime = date => {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    }

    return Swal.fire({
      title: '',
      html: `
        <div class="receipt-container">
          <div class="receipt-title">
            <h3>Comprobante de Pago</h3>
          </div>
          <div class="receipt-body">
            <div class="receipt-section">
              <div class="receipt-row">
                <span class="receipt-label">Monto</span>
                <span class="receipt-value">$${totalPrice().toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div class="receipt-section">
              <div class="receipt-row">
                <span class="receipt-label">Banco</span>
                <h5>GataBank</h5>
              </div>
            </div>
            <div class="receipt-section">
              <div class="receipt-row">
                <span class="receipt-label">Destinatario</span>
                <span class="receipt-value">${nombreDestinatario}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Dirección</span>
                <span class="receipt-value">${direccionEntrega}</span>
              </div>
            </div>
            <div class="receipt-footer">
              <div class="receipt-row">
                <span class="receipt-label">Fecha y hora</span>
                <span class="receipt-value">${formatDate(currentDate)} ${formatTime(currentDate)}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">N° de operación</span>
                <span class="receipt-value">${generateTicketNumber()}</span>
              </div>
            </div>
          </div>
        </div>
        `,
      icon: null,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#28a745',
      customClass: {
        popup: 'receipt-popup',
        confirmButton: 'receipt-button'
      },
      width: '450px'
    })
  })
  .then(() => {
    setCart([])
    navigate('/')
  })
}


  {/*Página del carrito de compras, donde el usuario puede ver y editar los productos que va a comprar.*/}
  return (
    <>
      <BackButton />
      <main className="big_container_cart">
        <div className="section_left">
          <div className="products">
            <h2>Detalles del Pedido:</h2>
            {cart.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="product_cart">
                  <div className="img_section">
                    <img
                      className="product_img"
                      src={item.img}
                      alt={item.name}
                    />
                    <h5>{item.name}</h5>
                  </div>
                  <div className="price_stock">
                    <span className="price">
                      Precio: ${item.price.toLocaleString('es-CL')}
                    </span>
                    <span className="stock">Cantidad: {item.quantity}</span>
                    <span className="subtotal">
                      {' '}
                      Subtotal: $
                      {(item.price * item.quantity).toLocaleString(
                        'es-CL'
                      )}{' '}
                    </span>
                  </div>
                  <div className="button_items">
                    <button
                      className="btn-round btn-qty"
                      onClick={() => {
                        toast({
                          icon: 'info',
                          title: `Has quitado 1 ${item.name} del carrito.`
                        })
                        subtraction(item.id)
                      }}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <button
                      className="btn-round btn-qty"
                      onClick={() => {
                        toast({
                          icon: 'success',
                          title: `Has agregado 1 ${item.name} del carrito.`
                        })
                        updateQuantity(item.id, item.quantity + 1)
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      className="btn-round btn-cart"
                      onClick={() => {
                        toast({
                          icon: 'warning',
                          title: `Has Removido ${item.name} del carrito.`
                        })
                        updateQuantity(item.id, 0)
                      }}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="total_option">
            <h5 className="total_title">
              Total: ${totalPrice().toLocaleString('es-CL')}{' '}
            </h5>
            <div className="total_button">
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={paymentStep}
              >
                Vaciar Carrito
              </Button>
              <Button
                variant="success"
                onClick={handleContinue}
                disabled={paymentStep || cart.length === 0}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>

        <div className="section_right">
          <h2>Verificación y Pago:</h2>
          <div className="payment_container">
            <p className="price">
              Total de artículos:{' '}
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </p>
            <p className="total_title">
              Total a pagar: ${totalPrice().toLocaleString('es-CL')}
            </p>

            <div
              className={`payment-selection-text ${paymentStep && !selectedPayment ? 'visible' : ''}`}
            >
              <p>Por favor Seleccionar un Método de Pago</p>
            </div>
            <div className={`kind_payment ${paymentStep ? 'visible' : ''}`}>
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method.id)
                    setDeliveryConfirmed(false)
                  }}
                  className={`payment_option ${selectedPayment === method.id ? 'selected' : ''}`}
                >
                  <img
                    className="img_card"
                    src={method.img}
                    alt={method.label}
                  />
                  <p className="payment_title"> {method.label}</p>
                </button>
              ))}
            </div>

            <div
              className={`delivery-info-container ${
                (selectedPayment === 'credito' ||
                  selectedPayment === 'debito') &&
                paymentStep &&
                !deliveryConfirmed
                  ? 'visible'
                  : ''
              }`}
            >
              <div className="delivery-instruction">
                <i className="fa-solid fa-truck"></i>
                <span>Datos para la entrega a domicilio</span>
              </div>
              <div className="delivery-form">
                <div className="form-group">
                  <label htmlFor="nombreDestinatario">
                    Nombre de quien recibirá el pedido:
                  </label>
                  <input
                    type="text"
                    id="nombreDestinatario"
                    placeholder="Nombre completo del destinatario"
                    value={nombreDestinatario}
                    onChange={e => setNombreDestinatario(e.target.value)}
                    className="delivery-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="direccionEntrega">Agrega tu dirección:</label>
                  <input
                    type="text"
                    id="direccionEntrega"
                    placeholder="Dirección completa para la entrega"
                    value={direccionEntrega}
                    onChange={e => setDireccionEntrega(e.target.value)}
                    className="delivery-input"
                    required
                  />
                </div>
                <div className="delivery-button-container">
                  <button
                    type="button"
                    onClick={handleConfirmDelivery}
                    className="confirm-delivery-btn"
                  >
                    <i className="fa-solid fa-check"></i>
                    {" "}Confirmar Datos de Entrega
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`credit-card-container ${
                (selectedPayment === 'credito' ||
                  selectedPayment === 'debito') &&
                paymentStep &&
                deliveryConfirmed
                  ? 'visible'
                  : ''
              }`}
            >
              <div className="card-instruction">
                <i className="fa-solid fa-credit-card"></i>
                <span>Ingrese los datos de la tarjeta</span>
              </div>
              <div className="card-background">
                <img
                  src="/imgs/gata-card-clean.png"
                  alt="Tarjeta GataBank"
                  className="card-image"
                />
                <div className="card-type-label">
                  {selectedPayment === 'credito'
                    ? 'Tarjeta de Crédito'
                    : 'Tarjeta de Débito'}
                </div>
                <form
                  className="card_form_overlay"
                  onSubmit={e => e.preventDefault()}
                >
                  <div className="card-number-section">
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                      value={numeroTarjeta}
                      onChange={e =>
                        setNumeroTarjeta(formatCardNumber(e.target.value))
                      }
                      className="card-number-input"
                      required
                    />
                  </div>

                  <div className="card-holder-section">
                    <input
                      type="text"
                      placeholder="Nombre del Titular"
                      maxLength="26"
                      value={nombreTitular}
                      onChange={e => setNombreTitular(e.target.value)}
                      className="card-holder-input"
                      required
                    />
                  </div>

                  <div className="card-details-section">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength="5"
                      value={expiracion}
                      onChange={e =>
                        setExpiracion(formatExpiry(e.target.value))
                      }
                      className="card-expiry-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength="3"
                      value={cvv}
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '')
                        setCvv(value)
                      }}
                      className="card-cvv-input"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>
            <div
              className={`cash-payment-text ${selectedPayment === 'efectivo' && paymentStep ? 'visible' : ''}`}
            >
              <div className="cash-payment-info">
                <div className="cash-header">
                  <i className="fa-solid fa-money-bills"></i>
                  <h4>Pago en Efectivo</h4>
                </div>
                <div className="cash-content">
                  <p>
                    <strong>¿Dónde pagar?</strong> Al retirar tu compra en
                    nuestra tienda.
                  </p>
                  <p>
                    <strong>Plazo:</strong>{' '}
                    <span className="highlight">24 horas</span> para retirar tu
                    pedido.
                  </p>
                </div>
                <div className="cash-tip">
                  <i className="fa-solid fa-lightbulb"></i>
                  <span>Trae el monto exacto para agilizar tu compra</span>
                </div>
              </div>
            </div>
          </div>
          <div className="total_button">
            <Button
              variant="danger"
              onClick={handleBack}
              disabled={!paymentStep}
            >
              Volver
            </Button>
            <Button
              type="button"
              variant="success"
              onClick={handlePay}
              disabled={!paymentStep || !selectedPayment}
            >
              {' '}
              Pagar{' '}
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

export default Cart
