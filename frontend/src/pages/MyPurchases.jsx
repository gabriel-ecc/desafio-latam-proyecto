// Página donde el usuario puede ver el historial de sus compras.
import React from 'react'
import './MyPurchases.css'

export default function MyPurchases() {
  return (
    <div className="my-purchases-container">
      <div className="my-purchases-header">
        <h1>Mis Compras</h1>
        <p>Historial de todas tus compras realizadas</p>
      </div>

      <div className="work-in-progress">
      <img src="/imgs/gata-in-progress.png" alt="Trabajo en Progreso" className="wip" />
      </div>
    </div>
  )
}
