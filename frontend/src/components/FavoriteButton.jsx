// Botón para agregar o quitar un producto de la lista de favoritos (separación de responsabilidades).
import PropTypes from "prop-types"
import "./Card.css" // O crea un archivo FavoriteButton.css si quieres estilos separados

const FavoriteButton = ({ isFavorite, onClick }) => (
  <button
    className="btn-round heart-btn"
    aria-label="Agregar a favoritos"
    onClick={onClick}
    type="button"
  >
    <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
  </button>
)

FavoriteButton.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default FavoriteButton