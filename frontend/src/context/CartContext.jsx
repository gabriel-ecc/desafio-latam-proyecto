import { createContext, useContext, useEffect, useState } from "react"
import { URLBASE, apiVersion } from "../config/constants.js"
import { UserContext } from './UserContext.jsx'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const { user, token } = useContext(UserContext)  
    const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : []
  })

  const [orderId, setOrderId] = useState(() => {
    return localStorage.getItem('tempOrderId') || null
  })

  //Carrito Temporal
  const handleTemporaryCart = async(newCart) => {
    if (!user) return console.error("Usuario no logueado")
    try {
      let currentOrderId = orderId
      if (!currentOrderId) {
          const res = await fetch(`${URLBASE}${apiVersion}/cart?userId=${user.id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` } // token opcional si no usas middleware
          })

      if (!res.ok) throw new Error("No se pudo obtener carrito temporal")
        const data = await res.json()
        currentOrderId = data.id
        setOrderId(currentOrderId)
        localStorage.setItem('tempOrderId', currentOrderId)
      }
      const payload = {
        orderId: currentOrderId, // asegura que 'user' venga del contexto
        items: newCart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: Math.round(item.price)
        }))
      }
       const response = await fetch(`${URLBASE}${apiVersion}/cart`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error guardando carrito temporal:", errorData)
      return
    }
    console.log("Carrito temporal guardado en backend")
  } catch (error) {
    console.error("Error guardando carrito temporal:", error)
  }
  }

    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cart))
      if (cart.length > 0 && user && token) {
        handleTemporaryCart(cart)
      }
    }, [cart,user, token])

  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      const productExist = prevCart.find(p => p.id === item.id)
      if(productExist){
        return prevCart.map(p =>
          p.id === item.id ? {...p, quantity: p.quantity + quantity} : p
        )
      } else {
        return [...prevCart, {...item, quantity}]
      }
    })
  }

// Con esta función eliminaremos los articulos con 0 en el carrito

  const updateQuantity = (id, newQuantity) => {
    if(newQuantity === 0) {
      setCart(oldCart => oldCart.filter(item => item.id !== id))
    } else {
      setCart(oldCart =>
        oldCart.map(item =>
          item.id === id ? {...item, quantity: newQuantity } :item
        )
      )
    }
  }

// Resto Cantidades o lo saco del carrito

  const subtraction = (id) => {
    const product = cart.find(item => item.id === id)
    if (product.quantity > 1) {
      updateQuantity(id, product.quantity - 1)
    } else if (product.quantity === 1) {
      updateQuantity(id, 0)
    }
  }

  // Precio Total

  const totalPrice = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  }
  const total = totalPrice()

  return (
    <CartContext.Provider value={{ cart, setCart, updateQuantity, subtraction, totalPrice, addToCart, handleTemporaryCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default function useCart() {
  return useContext(CartContext)
}