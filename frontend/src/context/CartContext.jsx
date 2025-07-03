import { createContext, useContext, useState } from "react"

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Aquí va la lógica real del carrito
  const [cart, setCart] = useState([])

  // Ejemplo de función para calcular el total
  const calculateTotalPrice = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, setCart, calculateTotalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export default function useCart() {
  return useContext(CartContext)
}