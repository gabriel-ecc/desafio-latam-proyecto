import ProtectedRoute from "./ProtectedRoute"
import Users from "../pages/Users"
import Inventory from "../pages/Inventory"
import EditProduct from "../pages/EditProduct"

// Permisos comunes
const EMPLOYEE_ADMIN = [2, 3]

// Helper para crear componentes protegidos
const withProtection = (Component) => () => (
  <ProtectedRoute allowedUserTypes={EMPLOYEE_ADMIN}>
    <Component />
  </ProtectedRoute>
)

// Exportar componentes protegidos
export const ProtectedUsers = withProtection(Users)
export const ProtectedInventory = withProtection(Inventory) 
export const ProtectedEditProduct = withProtection(EditProduct)
