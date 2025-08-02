import { createContext, useContext, useState } from "react"

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  //Primera función es para agregar al carrito y descartar duplicados

  const addtoCart = (item, quantity = 1) => {
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
    } else if (quantity && product.quantity === 1) {
      updateQuantity(id, 0)
    }
  }

  // Precio Total

  const totalePrice = () => {
    return cart.reduce((total, item) => {
      return total + item.price * item.count
    }, 0)
  }
  const total = totalePrice()

  return (
    <CartContext.Provider value={{ cart, setCart, updateQuantity, subtraction, totalePrice, addtoCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default function useCart() {
  return useContext(CartContext)
}