import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pool from './db/schema/config.js'
import path from 'path'

// importamos las rutas
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import seasonRoutes from './routes/seasonRoutes.js'
import productsRoutes from './routes/productsRoutes.js'
import favoritesRoutes from './routes/favoritesRoutes.js'
import ordersRoutes from './routes/ordersRoutes.js'
import cartTemporaryRoutes from './routes/cartRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

// Cargar archivo YAML
const swaggerDocument = YAML.load('./docs/swagger.yml')

// creamos la instancia del servidor/framework web express
const app = express()

// Sirve la documentación de Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
)

// cargamos el middleware
app.use(cors())
app.use(express.json())

// disponibilizamos las apis
app.use('/api/v1', userRoutes) // RegisterUser, lockUser, etc...
app.use('/api/v1', authRoutes) // Autenticacion de usuarios
app.use('/api/v1', categoriesRoutes) // Categorias de Productos
app.use('/api/v1', seasonRoutes) // Temporadas de Productos
app.use('/api/v1', productsRoutes) // Ruta de Productos
app.use('/api/v1', favoritesRoutes) // Ruta de Favoritos
app.use('/api/v1', ordersRoutes) // Ruta Ordenes
app.use('/api/v1', cartTemporaryRoutes) // Ruta Carrito
app.use('/api/v1', dashboardRoutes) // Ruta al dashboard

// Disponer imagenes para recursos de pagina web
const __dirname = path.resolve()
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')))

// Connect to the database for a quick check
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la DB:', err.message)
  } else {
    console.log(res.rows[0].now, 'Base de datos arriba:')
  }
})

export default app