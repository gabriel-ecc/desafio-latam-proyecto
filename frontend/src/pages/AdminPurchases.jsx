// Vista para que los administradores vean todas las compras de clientes
import React from 'react'
import BackButton from '../components/BackButton'
import './AdminPurchases.css'

const AdminPurchases = () => {
  return (
    <div className="admin-purchases-container">
      <BackButton />
      <div className="admin-purchases-header">
        <h1>Gestión de Compras</h1>
        <p>Historial completo de compras realizadas por todos los clientes</p>
      </div>
    </div>
  )
}

export default AdminPurchases
