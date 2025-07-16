import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ENDPOINT } from '../config/constants'
import './EditProduct.css'

// Formulario para editar la información de un producto existente.
export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = id !== '0'

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    season_id: '',
    img: null,
  })
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, seasonsRes] = await Promise.all([
          axios.get(ENDPOINT.categories),
          axios.get(ENDPOINT.seasons),
        ])
        setCategories(categoriesRes.data)
        setSeasons(seasonsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (isEditing) {
      setLoading(true)
      axios
        .get(`${ENDPOINT.products}/${id}`)
        .then(({ data }) => {
          setProduct({
            name: data.product_name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category_id: data.category_id,
            season_id: data.season_id,
            img: data.product_photo, 
          })
          setImagePreview(data.img) 
        })
        .catch((error) => {
          console.error('Error fetching product:', error)
          navigate('/inventario') 
        })
        .finally(() => setLoading(false))
    }
  }, [id, isEditing, navigate])

  const validateForm = () => {
    const newErrors = {}
    if (!product.name.trim()) newErrors.name = 'El nombre es requerido.'
    if (!product.description.trim())
      newErrors.description = 'La descripción es requerida.'
    if (!product.price || product.price <= 0)
      newErrors.price = 'El precio debe ser un número positivo.'
    if (product.stock === '' || product.stock < 0)
      newErrors.stock = 'El stock no puede ser un número negativo.'
    if (!product.category_id)
      newErrors.category = 'Debe seleccionar una categoría.'
    if (!product.season_id) newErrors.season = 'Debe seleccionar una temporada.'
    if (!isEditing && !product.img)
      newErrors.img = 'La foto del producto es requerida.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProduct((prev) => ({ ...prev, img: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('description', product.description)
    formData.append('price', product.price)
    formData.append('stock', product.stock)
    formData.append('productCategory', product.category_id)
    formData.append('seasonCategory', product.season_id)
    if (product.img) {
      formData.append('productPhoto', product.img)
    }

    setLoading(true)
    try {
      if (isEditing) {
        await axios.put(`${ENDPOINT.products}/${id}`, formData)
      } else {
        await axios.post(ENDPOINT.products, formData)
      }
      alert(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito.`)
      navigate('/inventario')
    } catch (error) {
      console.error('Error submitting product:', error)
      alert('Ocurrió un error al guardar el producto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-product-container">
      <h2>{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input type="text" id="name" name="name" value={product.name} onChange={handleChange} />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" value={product.description} onChange={handleChange}></textarea>
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input type="number" id="price" name="price" value={product.price} onChange={handleChange} min="0" />
            {errors.price && <p className="error-message">{errors.price}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} min="0" />
            {errors.stock && <p className="error-message">{errors.stock}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Categoría de Producto</label>
            <select id="category_id" name="category_id" value={product.category_id} onChange={handleChange}>
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="error-message">{errors.category}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="season_id">Categoría de Temporada</label>
            <select id="season_id" name="season_id" value={product.season_id} onChange={handleChange}>
              <option value="">Seleccione una temporada</option>
              {seasons.map((season) => (
                <option key={season.id} value={season.id}>{season.name}</option>
              ))}
            </select>
            {errors.season && <p className="error-message">{errors.season}</p>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="img">Foto del Producto</label>
          <input type="file" id="img" name="img" onChange={handleFileChange} accept="image/*" />
          {imagePreview && <img src={imagePreview} alt="Previsualización" className="image-preview" />}
          {errors.img && <p className="error-message">{errors.img}</p>}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </form>
    </div>
  )
}
