import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams
} from 'react-router-dom'
import Navbar from './components/Navbar'
import {
  ProtectedUsers,
  ProtectedInventory,
  ProtectedEditProduct,
  ProtectedCreateEmployee,
  ProtectedAdminPurchases,
  ProtectedDashboard
} from './components/ProtectedComponents'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Products from './pages/Products'
import SeasonProducts from './pages/SeasonProducts'
import Favorites from './pages/Favorites'
import PurchaseConfirmation from './pages/PurchaseConfirmation'
import MyPurchases from './pages/MyPurchases'
import OrderDetail from './pages/OrderDetail'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

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
        <Route path="/nosotros" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/usuarios" element={<ProtectedUsers />} />
        <Route path="/users" element={<ProtectedUsers />} />
        <Route path="/create-employee" element={<ProtectedCreateEmployee />} />
        <Route path="/admin-compras" element={<ProtectedAdminPurchases />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/cart" element={
          <ProtectedRoute allowedUserTypes={[1, 2, 3]} redirectTo='/login'>
            <Cart/>
          </ProtectedRoute>
          }
        />
        <Route path="/products" element={<Products />} />
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
