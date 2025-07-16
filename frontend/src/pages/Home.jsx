// Página de inicio. Muestra la bienvenida, productos destacados e información general.
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../pages/Home.css"
import "../components/Card.css"
import ProductCard from "../components/Card"
import useCart from "../context/CartContext.jsx"

// Array de productos simulados
const mockProducts = [
  {
    desc: "Verdura",
    id: "p001",
    img: "/imgs/zanahoria.jpeg",
    seasons: ["verano", "otoño"],
    name: "Zanahoria 1kg",
    price: 5950,
    stock: 10,
  },
  {
    desc: "Fruta",
    id: "p002",
    img: "/imgs/manzana.jpeg",
    seasons: ["otoño", "invierno"],
    name: "Manzana 1kg",
    price: 7250,
    stock: 10,
  },
  {
    desc: "Verdura",
    id: "p003",
    img: "/imgs/brocoli.jpeg",
    seasons: ["invierno", "primavera"],
    name: "Brócoli 1kg",
    price: 5990,
    stock: 10,
  },
  {
    desc: "Fruta",
    id: "p004",
    img: "/imgs/platano.jpeg",
    seasons: ["primavera", "verano"],
    name: "plátano 1kg",
    price: 9590,
    stock: 10,
  },
  {
    desc: "Fruta",
    id: "p005",
    img: "/imgs/pera.jpeg",
    seasons: ["verano", "otoño"],
    name: "Pera 1kg",
    price: 6450,
    stock: 10,
  },
  {
    desc: "Verdura",
    id: "p006",
    img: "/imgs/lechuga.jpeg",
    seasons: ["otoño", "primavera"],
    name: "Lechuga 1kg",
    price: 8500,
    stock: 10,
  },
]

export default function Home() {
  const [cards, setCards] = useState([])
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Imágenes del panel deslizable (ajusta las rutas si es necesario)
  const sliderImages = [
    { id: 1, src: "/imgs/delibery.jpg", alt: "Ofertas especiales" },
    { id: 2, src: "/imgs/agosto.jpg", alt: "Promoción de frutas" },
    { id: 3, src: "/imgs/septiembre.jpg", alt: "Ofertas especiales" },
    { id: 4, src: "/imgs/beneficios.jpg", alt: "Verduras de temporada" },
    { id: 5, src: "/imgs/mas.jpg", alt: "Verduras de temporada" },
  ]

  useEffect(() => {
    document.body.classList.add("home-background")
    return () => {
      document.body.classList.remove("home-background")
    }
  }, [])

  // Cargar productos simulados al montar el componente
  useEffect(() => {
    // Agrega las propiedades que espera ProductCard
    const augmentedData = mockProducts.map((card) => ({
      ...card,
      category: card.desc || "General",
      isFavorite: false,
    }))
    setCards(augmentedData)
  }, [])

  const handleViewMore = (id) => {
    navigate(`/card/${id}`)
  }

  const handleToggleFavorite = (id) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFavorite: !card.isFavorite } : card
      )
    )
  }

  const handleAddToCart = (productWithQuantity) => {
    const { quantity, ...product } = productWithQuantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div className="container">
      {/* Panel superior */}
      <div className="hero-panel">
        <img
          src="/imgs/panel.jpeg"
          alt="Banner de productos frescos"
        />
      </div>

      {/* Panel deslizable de imágenes */}
      <div className="sliding-panel">
        {sliderImages.map((image) => (
          <div className="slide" key={image.id}>
            <img src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>

      <div className="row card-container">
        {cards.map((card) => (
          <div className="col-lg-3 col-md-5 mb-4" key={card.id}>
            <ProductCard
              product={card}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewMore}
            />
          </div>
        ))}
      </div>
    </div>
  )
}