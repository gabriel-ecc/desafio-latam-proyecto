import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// importamos las rutas
// import postsRoutes from './routes/postsRoutes.js'

// configuramos el puerto del servidor que va a escuchar
const PORT = process.env.PORT || 3000

// creamos la instancia del servidor/framework web express
const app = express()

// cargamos el middleware
app.use(cors())
app.use(express.json())

// cargamos las rutas
// app.use(postsRoutes)

// dejamos el servidor escuchando en el puerto configurado
app.listen(PORT, console.log(`[${new Date().toLocaleString()}] Server running on http://localhost:${PORT}`))
