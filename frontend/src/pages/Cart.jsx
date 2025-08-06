import useCart, { CartContext } from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js' 
import ProductCard from '../components/Card'
import axios from 'axios'
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
    <main className='container_cart'>
      <div className='content_cart'>
        <div className='sections_cart'>
          <div className="container_1">
            <h2>Detalles del Pedido:</h2>
              {cart.length === 0 ? (
              <p>Tu carrito está vacío.</p>
              ) : (
              cart.map((item) => (
            <div key={item.id} className='card-container'>
              <div className='min_box1'>
              <img className='product-img'
                src={item.img}
                alt={item.name}
              />
              <h5>{item.name}</h5>
              <p>Precio: ${item.price}</p>
            </div>
            <div className='min_box2'>
            <p>Cantidad: {item.quantity}</p>
            <div className='button_items'>
              <button className='one_button' onClick={() => subtraction(item.id)}>-</button>
              <button className='one_button' onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className='one_button_delete' onClick={() => updateQuantity(item.id, 0)}>Eliminar</button>
            </div>          
            </div>
        </div>
       ))
      )}
      <div>
        <h5>Total: ${totalPrice().toLocaleString('es-CL')} </h5>
      </div>
    </div>
    <div className="container_2">
      <h2>Verificación y Pago:</h2>
      <div>
        <p>Total de artículos: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p>Total a pagar: ${totalPrice().toLocaleString('es-CL')}</p>
      </div>
      <div>
        {paymentMethods.map(method => (
        <img
          key={method.id}
          src={method.img}
          alt={method.label}
          className={`payment-option ${selectedPayment === method.id ? 'selected' : ''}`}
          onClick={() => setSelectedPayment(method.id)}
        />
       ))}
      </div>
    </div>    
    </div>
    </div>
    </main>
  )
}

export default Cart