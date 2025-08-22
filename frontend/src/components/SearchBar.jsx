import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './SearchBar.css'

const SearchBar = ({
  products = [],
  onProductSelect,
  placeholder = 'Buscar productos...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const searchRef = useRef(null)
  const suggestionRefs = useRef([])

  // Filtrar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = products.filter(
        product =>
          product.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          product.season.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered.slice(0, 8)) // Limitar a 8 resultados
      setShowSuggestions(true) // Mostrar siempre que haya al menos 2 caracteres
      setHighlightedIndex(-1)
    } else {
      setFilteredProducts([])
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }
  }, [searchTerm, products])

  // Manejar cambios en el input
  const handleInputChange = e => {
    setSearchTerm(e.target.value)
  }

  // Manejar selección de producto
  const handleProductSelect = product => {
    setSearchTerm(product.name)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  // Manejar navegación con teclado
  const handleKeyDown = e => {
    // Manejar Enter para seleccionar producto
    if (e.key === 'Enter') {
      e.preventDefault()

      if (
        showSuggestions &&
        filteredProducts.length > 0 &&
        highlightedIndex >= 0
      ) {
        // Si hay una sugerencia seleccionada, usarla
        handleProductSelect(filteredProducts[highlightedIndex])
      } else if (showSuggestions && filteredProducts.length > 0) {
        // Si hay sugerencias pero no hay una seleccionada, seleccionar la primera
        handleProductSelect(filteredProducts[0])
      }
      return
    }

    if (!showSuggestions || filteredProducts.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        )
        break

      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        )
        break

      case 'Escape':
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        searchRef.current?.blur()
        break
    }
  }

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Limpiar búsqueda
  const handleClear = () => {
    setSearchTerm('')
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    searchRef.current?.focus()
  }

  return (
    <div className={`search-bar ${className}`} ref={searchRef}>
      <div className="search-input-container">
        <div className="search-icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setShowSuggestions(true)
            }
          }}
        />

        {searchTerm && (
          <button className="clear-button" onClick={handleClear}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {filteredProducts.length > 0
            ? filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={el => (suggestionRefs.current[index] = el)}
                  className={`suggestion-item ${
                    index === highlightedIndex ? 'highlighted' : ''
                  }`}
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="suggestion-image">
                    <img
                      src={product.img}
                      alt={product.name}
                      onError={e => {
                        e.target.src = '/imgs/placeholder.svg'
                      }}
                    />
                  </div>
                  <div className="suggestion-content">
                    <div className="suggestion-details">
                      <div className="suggestion-name">{product.name}</div>
                      <div className="suggestion-category">
                        {product.category} • {product.season}
                      </div>
                    </div>
                    <div className="suggestion-price">
                      ${product.price.toLocaleString('es-cl')}
                    </div>
                  </div>
                </div>
              ))
            : searchTerm.length >= 2 && (
                <div className="no-results">
                  <i className="fa-solid fa-search"></i>
                  <span>No se encontraron productos con "{searchTerm}"</span>
                </div>
              )}
        </div>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      season: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      img: PropTypes.string.isRequired
    })
  ),
  onProductSelect: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string
}

export default SearchBar
