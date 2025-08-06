import useCart, { CartContext } from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js' 
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import '../pages/Cart.css'

const Cart = () => {
  const { cart, setCart, updateQuantity, subtraction, totalPrice, addToCart } = useContext(CartContext)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const { user } = useProfile()
  const navigate = useNavigate()

  const paymentMethods = [
    { id: 'visa', label: 'Visa', img: '/imgs/visa.png' },
    { id: 'mastercard', label: 'MasterCard', img: '/imgs/mastercard.png' },
    { id: 'paypal', label: 'PayPal', img: '/imgs/paypal.png' }
  ]

    useEffect(() => {
    document.body.classList.add('home-background')
    return () => {
      document.body.classList.remove('home-background')
    }
  }, [])

  return (
    <main className='big_container_cart'>
        <div className='section_left'>
          <div className="products">
            <h2>Detalles del Pedido:</h2>
              {cart.length === 0 ? (
              <p>Tu carrito está vacío.</p>
              ) : (
              cart.map((item) => (
            <div key={item.id} className='product_cart'>
              <div className='img_section'>
              <img className='product_img'
                src={item.img}
                alt={item.name}
              />
              <h5>{item.name}</h5>
            </div>
              <div className='price_stock'>
                <span className='price'>Precio: ${item.price.toLocaleString('es-CL')}</span>
                <span className='stock'>Cantidad: {item.quantity}</span>
                <span className='subtotal'> Subtotal: ${(item.price * item.quantity).toLocaleString('es-CL')} </span>
              </div>
            <div className='button_items'>
              <button className='btn-round btn-qty' onClick={() => subtraction(item.id)}><i className="fa-solid fa-minus"></i></button>
              <button className='btn-round btn-qty' onClick={() => updateQuantity(item.id, item.quantity + 1)}><i className="fa-solid fa-plus"></i></button>
              <button className='btn-round btn-cart' onClick={() => updateQuantity(item.id, 0)}><i className="fa-solid fa-trash"></i></button>
            </div>          
        </div>
       ))
      )}
    </div>
      <div className='total_option'>
        <h5 className='total_title'>Total: ${totalPrice().toLocaleString('es-CL')} </h5>
        <div className='total_button'>
        <Button variant='danger'>Cancelar</Button>
        <Button variant='success'>Continuar</Button>
      </div>
      </div>
  </div>


    <div className='section_right'>
      <div className='payment_container'>
        <h2>Verificación y Pago:</h2>
        <p>Total de artículos: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p>Total a pagar: ${totalPrice().toLocaleString('es-CL')}</p>
      <div className='payment_options'>
        {paymentMethods.map(method => (
        <img
          key={method.id}
          src={method.img}
          alt={method.label}
          className={`payment_option ${selectedPayment === method.id ? 'selected' : ''}`}
          onClick={() => setSelectedPayment(method.id)}
        />
       ))}
      </div>
    </div>  
    </div>    
    </main>
  )
}

export default Cart