// Página Nosotros - Información sobre la empresa
import React from 'react'
import './About.css'

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Nosotros</h1>
        <p>Conoce más sobre nuestra verdulería y nuestro compromiso con la calidad</p>
      </div>

      <div className="work-in-progress">
        <img src="/imgs/gata-in-progress.png" alt="Trabajo en Progreso" className="wip" />
      </div>
    </div>
  )
}

export default About
