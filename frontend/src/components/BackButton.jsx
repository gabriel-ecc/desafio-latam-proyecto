import { useNavigate } from 'react-router-dom'
import './BackButton.css'

const BackButton = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    // Si hay historial previo, retrocede; si no, va al inicio
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <button
      className="back-button"
      onClick={handleGoBack}
      title="Volver atrás"
      aria-label="Volver atrás"
    >
      <i className="fas fa-arrow-left"></i>
      <span className="back-button-text">Volver</span>
    </button>
  )
}

export default BackButton
