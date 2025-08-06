// Dashboard del administrador - Vista general del sistema
import React from 'react'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard del Administrador</h1>
        <p>Panel de control y estadísticas del sistema</p>
      </div>

      <div className="work-in-progress">
        <img
          src="/imgs/gata-in-progress.png"
          alt="Trabajo en Progreso"
          className="wip"
        />
      </div>
    </div>
  )
}

export default Dashboard
