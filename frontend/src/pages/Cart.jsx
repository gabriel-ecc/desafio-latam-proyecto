import useCart, { CartContext } from '../context/CartContext.jsx'
import { ENDPOINT } from '../config/constants.js'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js' 
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
    <main className="container">
    <div className="container_1">
      <h4>Detalles del Pedido:</h4>
      <div>
        {cart.length === 0 ? (
       <p>Tu carrito está vacío.</p>
        ) : (
        cart.map((item) => (
      <div key={item.id}>
        <img
        src={item.img}
        alt={item.name}
        />
        <h5>{item.name}</h5>
        <p>Precio: ${item.price}</p>
        <p>Cantidad: {item.quantity}</p>
        <button onClick={() => subtraction(item.id)}>-</button>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        <button onClick={() => updateQuantity(item.id, 0)}>Eliminar</button>
      </div>
      ))
    )}
      </div>
      <div>
        <h5>Total: ${totalPrice()} </h5>
      </div>
    </div>
    <div className="container_2">
      <h4>Verificación y Pago:</h4>
      <div>
        <p>Total de artículos: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p>Total a pagar: ${totalPrice()}</p>
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
    </main>
  )
}

export default Cart