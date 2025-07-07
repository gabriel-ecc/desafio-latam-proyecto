import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pool from './db/schema/config.js'

// importamos las rutas
import registerUser from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'

// configuramos el puerto del servidor que va a escuchar
const PORT = process.env.PORT || 3000

// creamos la instancia del servidor/framework web express
const app = express()

// cargamos el middleware
app.use(cors())
app.use(express.json())

// cargamos las rutas
app.use('/', registerUser)
app.use('/', authRoutes)
app.use('/', categoriesRoutes)

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
