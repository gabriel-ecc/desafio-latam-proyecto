// Página Nosotros - Información sobre la empresa
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import './About.css'

const About = () => {
  const navigate = useNavigate()

  const handleStartShopping = () => {
    navigate('/')
  }

  return (
    <div className="about-container">
      <BackButton />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Llevando Frescura del Campo a Tu Mesa</h1>
            <p>
              Conectamos productores locales con familias que buscan
              alimentación saludable, sostenible y de calidad excepcional.
            </p>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/imgs/about-us-1.jpg"
            alt="La Gata de Campo - Frescura del campo"
          />
        </div>
      </section>

      {/* Stats and Origin Section */}
      <section className="stats-origin-section">
        <div className="stats-card">
          <div className="stat-item">
            <h3>150+</h3>
            <p>Productos Frescos</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>Productores Locales</p>
          </div>
        </div>

        <div className="origin-card">
          <h2>Nuestro Origen</h2>
          <p>
            "La Gata de Campo" surge del cariño de una de nuestras fundadoras
            por los gatos y de la conexión con el campo. Oscar Garín, Andreina
            Guerra, Gabriel Castillo y Carla Pacheco unimos fuerzas con la
            motivación de llevar productos de campo siempre frescos a las mesas
            de los chilenos.
          </p>
        </div>
      </section>

      {/* Products and Values Section */}
      <section className="products-values-section">
        <div className="content-wrapper">
          <h2>Cómo Simplificamos Tu Experiencia de Compra</h2>

          <div className="two-column-layout">
            <div className="products-column">
              <h3>Nuestros Productos</h3>
              <p>En La Gata de Campo encontrarás:</p>
              <ul>
                <li>Frutas de estación</li>
                <li>Verduras recién cosechadas</li>
                <li>Legumbres seleccionadas</li>
                <li>Carnes de calidad</li>
              </ul>
              <p>
                Todos nuestros productos provienen directamente de productores
                locales para garantizar frescura y apoyar el desarrollo de las
                comunidades rurales.
              </p>
            </div>

            <div className="values-column">
              <h3>Valores y Principios</h3>
              <p>
                Operamos bajo valores que guían cada etapa de nuestro trabajo:
              </p>
              <ul>
                <li>Frescura</li>
                <li>Sostenibilidad</li>
                <li>Cercanía con nuestros clientes</li>
                <li>Transparencia en el origen y manejo de los alimentos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section with Image */}
      <section className="mission-vision-section">
        <div className="content-with-image">
          <div className="text-content">
            <h2>Misión y Visión</h2>
            <p>
              En el corto plazo, nuestro foco está en consolidar nuestra sede en
              Santiago de Chile. A largo plazo, aspiramos a expandirnos a todas
              las regiones del país, llevando lo mejor del campo a cada hogar.
            </p>
            <div className="mission-details">
              <h4>Nuestra Misión</h4>
              <p>
                Conectar a las familias chilenas de cada rincón del país con
                productos frescos y de calidad directamente del campo.
              </p>

              <h4>Nuestra Visión</h4>
              <p>
                Ser la plataforma líder en Chile para la distribución de
                productos agrícolas frescos y sostenibles.
              </p>
            </div>
          </div>
          <div className="image-content">
            <img
              src="/imgs/regiones.png"
              alt="Expansión a todas las regiones de Chile"
            />
          </div>
        </div>
      </section>

      {/* Unique Proposition Section */}
      <section className="unique-proposition-section">
        <div className="content-with-image reverse">
          <div className="image-content">
            <img src="/imgs/eco-friendly.jpeg" alt="Empaques eco-friendly" />
          </div>
          <div className="text-content">
            <h2>Nuestra Propuesta Única</h2>
            <p>
              Lo que nos diferencia y enamora a quienes eligen La Gata de Campo:
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <h4>Empaques Eco-Friendly</h4>
                <p>
                  Reducimos el impacto ambiental con envases sostenibles y
                  biodegradables.
                </p>
              </div>
              <div className="feature-item">
                <h4>Frescura Excepcional</h4>
                <p>
                  Productos directo desde el campo, manteniendo toda su calidad
                  y sabor natural.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <div className="content-wrapper">
          <h2>Para Quién Elegimos La Gata de Campo</h2>

          <div className="community-grid">
            <div className="community-card">
              <h4>Familias Saludables</h4>
              <p>
                Familias que buscan alimentación nutritiva y de calidad para sus
                seres queridos.
              </p>
            </div>

            <div className="community-card">
              <h4>Chefs Emprendedores</h4>
              <p>
                Profesionales de la gastronomía que valoran ingredientes frescos
                y auténticos.
              </p>
            </div>

            <div className="community-card">
              <h4>Conscientes Ambientales</h4>
              <p>
                Personas comprometidas con su salud y el cuidado del medio
                ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Message */}
      <section className="final-message-section">
        <div className="content-wrapper">
          <h2>Un Acto de Amor</h2>
          <p>
            En La Gata de Campo creemos que comer bien es un acto de amor hacia
            nosotros mismos y hacia nuestro entorno. Te invitamos a recorrer
            nuestra app y descubrir la frescura del campo en cada pedido.
          </p>
          <button className="cta-button" onClick={handleStartShopping}>
            Comenzar a Comprar
          </button>
        </div>
      </section>
    </div>
  )
}

export default About
