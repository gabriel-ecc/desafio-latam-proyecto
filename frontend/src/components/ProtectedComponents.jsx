import ProtectedRoute from './ProtectedRoute'
import Users from '../pages/Users'
import Inventory from '../pages/Inventory'
import EditProduct from '../pages/EditProduct'
import CreateEmployee from '../pages/CreateEmployee'
import AdminPurchases from '../pages/AdminPurchases'
import Dashboard from '../pages/Dashboard'
import { useParams } from 'react-router-dom'

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

// Componente especial para EditProduct que maneja permisos según si es crear o editar
const ProtectedEditProductWithLogic = (props) => {
  const { id } = useParams()
  const isCreating = id === '0'
  const allowedTypes = isCreating ? ADMIN_ONLY : EMPLOYEE_ADMIN
  
  return (
    <ProtectedRoute allowedUserTypes={allowedTypes}>
      <EditProduct {...props} />
    </ProtectedRoute>
  )
}

// Exportar componentes protegidos
export const ProtectedUsers = withProtection(Users)
export const ProtectedInventory = withProtection(Inventory)
export const ProtectedEditProduct = ProtectedEditProductWithLogic
export const ProtectedCreateEmployee = withProtection(
  CreateEmployee,
  ADMIN_ONLY
)
export const ProtectedAdminPurchases = withProtection(AdminPurchases)
export const ProtectedDashboard = withProtection(Dashboard, ADMIN_ONLY)
