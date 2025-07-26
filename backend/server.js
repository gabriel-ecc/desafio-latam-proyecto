import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pool from './db/schema/config.js'
import path from 'path'

// importamos las rutas
import registerUser from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import seasonRoutes from './routes/seasonRoutes.js'
import productsRoutes from './routes/productsRoutes.js'

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

// Cargar archivo YAML
const swaggerDocument = YAML.load('../docs/swagger.yml')

// configuramos el puerto del servidor que va a escuchar
const PORT = process.env.PORT || 3000

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

// cargamos las rutas (/api para funcionar mejor con el frontend, (modificarlo si se estima conveniente)).
app.use('/api/v1', registerUser)
app.use('/api/v1', authRoutes)
app.use('/api/v1', categoriesRoutes)
app.use('/api/v1', seasonRoutes)
app.use('/api/v1', productsRoutes)

// Disponer imagenes para recursos de pagina web
const __dirname = path.resolve()
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads')))

// Connect to the database and then start the server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la DB:', err.message)
  } else {
    console.log(res.rows[0].now, 'Base de datos arriba:')
    // Subimos el server SÓLO después de que exista coneccion a la BD
    app.listen(PORT, () => {
      console.log(
        `[${new Date().toLocaleString()}] Servidor y Base de Datos corriendo en http://localhost:${PORT}`
      )
    })
  }
})

export default app
