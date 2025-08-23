import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // interceptamos las peticiones a /api/v1/*, /api-docs/* y /api/v1/uploads/*
  // y las re-enviamos al backend, en el puerto 3000
  server: {
    port: 5173, // Puerto donde se ejecuta el frontend
    proxy: {
      // Proxy para todas las rutas de la API que empiezan con /api/v1
      '/api/v1': {
        target: `${import.meta.env.VITE_API_URL}`, // Apuntamos al backend
        changeOrigin: true, // Importante para que el backend vea el origen correcto
        secure: false, // No usamos HTTPS
        // No es necesario 'rewrite' aquí porque la ruta '/api/v1' es la misma en ambos
      },
      // Proxy para la documentación de Swagger UI
      '/api-docs': {
        target: `${import.meta.env.VITE_API_URL}`, // Apuntamos al  backend donde se sirve Swagger
        changeOrigin: true,
        secure: false,
      },
      // Proxy para las imágenes estáticas ( /uploads en el backend )
      '/api/v1/uploads': {
        target: `${import.meta.env.VITE_API_URL}`, // Apuntamos al backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})