import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams
} from "react-router-dom"
import Navbar from "./components/Navbar"
import { ProtectedUsers, ProtectedInventory, ProtectedEditProduct } from "./components/ProtectedComponents"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Cart from "./pages/Cart"
import Products from "./pages/Products"
import Catalog from "./pages/Catalog"
import SeasonProducts from "./pages/SeasonProducts"
import Favorites from "./pages/Favorites"
import PurchaseConfirmation from "./pages/PurchaseConfirmation"
import MyPurchases from "./pages/MyPurchases"
import OrderDetail from "./pages/OrderDetail"
import ProductDetail from "./pages/ProductDetail"
import Footer from "./components/Footer"

// Componente para redireccionar /card/:id a /products/:id
const CardRedirect = () => {
  const { id } = useParams()
  return <Navigate to={`/products/${id}`} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* <-- Aquí va el Navbar, fuera de <Routes> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/usuarios" element={<ProtectedUsers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/inventario" element={<ProtectedInventory />} />
        <Route path="/editar-producto/:id" element={<ProtectedEditProduct />} />
        <Route path="/temporada" element={<SeasonProducts />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/confirmacion" element={<PurchaseConfirmation />} />
        <Route path="/mis-compras" element={<MyPurchases />} />
        <Route path="/detalle-pedido/:id" element={<OrderDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/card/:id" element={<CardRedirect />} />{' '}
        {/* Nueva ruta para redirección */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
