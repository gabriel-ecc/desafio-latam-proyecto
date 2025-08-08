import useCart, { CartContext } from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
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
  const { user } = useProfile()
  const navigate = useNavigate()

  //Requerimientos para el Pago
  const [nombreTitular, setNombreTitular] = useState('')
  const [numeroTarjeta, setNumeroTarjeta] = useState('')
  const [expiracion, setExpiracion] = useState('')
  const [cvv, setCvv] = useState('')

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

//Acción de botones de decisión tanto para la visualización de productos como para Validación de Pago

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
        setCart([]) // Vaciar carrito
        Swal.fire({
          title: 'Carrito vacío',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        })
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
  }

//Fromatear el número de tarjeta 

  const formatCardNumber = (value) => {
    const onlyNums = value.replace(/\D/g, '');
    const spaced = onlyNums.match(/.{1,4}/g)?.join(' ') || '';
   return spaced;
  }

//Formatear la fecha con / de forma automatica

  const formatExpiry = (value) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length === 0) return '';
    if (onlyNums.length <= 2) return onlyNums;
   return onlyNums.slice(0, 2) + '/' + onlyNums.slice(2, 4);
  }

  const handlePay = async() => {
    //No selecciona Pago
    if(!selectedPayment) {
      Swal.fire({
        icon: 'error',
        title: 'Selecciona un método de pago',
    })
    return
    }

    //Seleciona pago pero no coloca los datos completos
    if(selectedPayment === 'credito' || selectedPayment === 'debito' ){
      if (!nombreTitular.trim() || !expiracion.trim() || !cvv.trim() || !numeroTarjeta.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos de la tarjeta.',
        });
        return;
      }
    }
//Validación de expiración y código de seguridad

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
// Pago éxitoso

    await Swal.fire({
      title: 'Pago realizado con éxito',
      html: `
        <p>Se ha procesado tu pago correctamente.</p>`,
      icon: 'success',
      confirmButtonText: 'Cerrar'
    })
    setCart([])
    navigate('/')
  }

  // Página del carrito de compras, donde el usuario puede ver y editar los productos que va a comprar.

  return (
    <>
    <BackButton />
    <main className="big_container_cart">
//Sección de visualización de productos y totales

      <div className="section_left">
        <div className="products">
          <h2>Detalles del Pedido:</h2>
          {cart.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="product_cart">
                <div className="img_section">
                  <img className="product_img" src={item.img} alt={item.name} />
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
                    {(item.price * item.quantity).toLocaleString('es-CL')}{' '}
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



        <div className="total_option"> //Suma del total de productos cargados + Botones de decisión
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

//Sección de pago Cantidad Artículo + Pago + Botones de decisión

      <div className="section_right">
        <h2>Verificación y Pago:</h2>
        <div className="payment_container">
          <p className="price">
            Total de artículos:{' '}
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p className='total_title'>Total a pagar: ${totalPrice().toLocaleString('es-CL')}</p>

          {paymentStep && (
            <>
            {!selectedPayment && (
              <div>
               <p>Por favor Seleccionar un Método de Pago</p>
              </div>
            )}
              <div className="kind_payment">
                
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
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

              {(selectedPayment === 'credito' ||
                selectedPayment === 'debito') && (
                <form className="card_form" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label>Nombre del Titular</label>
                    <input
                      type="text"
                      placeholder="Rigoberto Felines P"
                      maxLength="25"
                      required
                    />
                    <label>Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength="19"
                      value={numeroTarjeta}
                      onChange={(e) => setNumeroTarjeta(formatCardNumber(e.target.value))}
                      required
                    />
                  </div>
                  <div className="card_date">
                    <div>
                      <label> Expiración </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={expiracion}
                        onChange={(e) => setExpiracion(formatExpiry(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <label> CVV </label>
                      <input
                        type="number"
                        placeholder="XXX"
                        maxLength="3"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </form>
              )}
              {selectedPayment === 'efectivo' && (
                <div>
                  <p>
                    {' '}
                    El pago en efectivo se realizará al momento de retirar la
                    compra.{' '}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="total_button">
          <Button variant="danger" onClick={handleBack} disabled={!paymentStep}>
            Volver
          </Button>
          <Button
            type='button' 
            variant="success" 
            onClick={handlePay} 
            disabled={!paymentStep || !selectedPayment}>
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
