import ProtectedRoute from './ProtectedRoute'
import Users from '../pages/Users'
import Inventory from '../pages/Inventory'
import EditProduct from '../pages/EditProduct'
import CreateEmployee from '../pages/CreateEmployee'

// Permisos comunes
const EMPLOYEE_ADMIN = [2, 3]
const ADMIN_ONLY = [3]

// Helper para crear componentes protegidos
const withProtection =
  (PageComponent, allowedTypes = EMPLOYEE_ADMIN) =>
  props => (
    <ProtectedRoute allowedUserTypes={allowedTypes}>
      <PageComponent {...props} />
    </ProtectedRoute>
  )

// Exportar componentes protegidos
export const ProtectedUsers = withProtection(Users)
export const ProtectedInventory = withProtection(Inventory)
export const ProtectedEditProduct = withProtection(EditProduct)
export const ProtectedCreateEmployee = withProtection(
  CreateEmployee,
  ADMIN_ONLY
)
