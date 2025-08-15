import { createContext, useContext, useEffect, useState } from "react"

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : []
  })

  //Carrito Temporal
  const handleTemporaryCart = async(newCart) => {
    try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: newCart, order_status: 1 })
    })
    console.log("Carrito temporal guardado en backend")
  } catch (error) {
    console.error("Error guardando carrito temporal:", error)
  }
  }

    useEffect(() => {
      localStorage.setItem('cart', JSON.stringify(cart))
      if (cart.length > 0) {
        handleTemporaryCart(cart)
      }
    }, [cart])

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
    <CartContext.Provider value={{ cart, setCart, updateQuantity, subtraction, totalPrice, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default function useCart() {
  return useContext(CartContext)
}