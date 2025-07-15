import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Users from "./pages/Users"
import Cart from "./pages/Cart"
import Products from "./pages/Products"
import Catalog from "./pages/Catalog"
import Inventory from "./pages/Inventory"
import EditProduct from "./pages/EditProduct"
import SeasonProducts from "./pages/SeasonProducts"
import Favorites from "./pages/Favorites"
import PurchaseConfirmation from "./pages/PurchaseConfirmation"
import MyPurchases from "./pages/MyPurchases"
import OrderDetail from "./pages/OrderDetail"
import Footer from "./components/Footer"

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* <-- Aquí va el Navbar, fuera de <Routes> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:season" element={<Products />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/editar-producto/:id" element={<EditProduct />} />
        <Route path="/temporada" element={<SeasonProducts />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/confirmacion" element={<PurchaseConfirmation />} />
        <Route path="/mis-compras" element={<MyPurchases />} />
        <Route path="/detalle-pedido/:id" element={<OrderDetail />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
