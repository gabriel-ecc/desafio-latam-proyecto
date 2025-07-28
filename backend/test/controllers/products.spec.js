import request from 'supertest'
import app from '../../server.js'

describe('API /products', () => {
  describe('GET /api/v1/products', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/products')
      expect(response.statusCode).toBe(200)
    })

    it('Deberia retornar productos con estructura correcta', async () => {
      const response = await request(app).get('/api/v1/products')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('Deberia aceptar parámetros de paginación', async () => {
      const response = await request(app).get('/api/v1/products?page=1&limit=5')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data')
    })

    it('Deberia aceptar filtros de categoría', async () => {
      const response = await request(app).get('/api/v1/products?category=1')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data')
    })

    it('Deberia aceptar filtros de temporada', async () => {
      const response = await request(app).get('/api/v1/products?season=1')
      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveProperty('data')
    })
  })

  describe('GET /api/v1/products/:id', () => {
    it('Deberia retornar un producto específico', async () => {
      // Primero obtenemos la lista para conseguir un ID válido
      const productsResponse = await request(app).get('/api/v1/products?limit=1')
      const products = productsResponse.body.data
      
      if (products && products.length > 0) {
        const productId = products[0].id
        const response = await request(app).get(`/api/v1/products/${productId}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('price')
      }
    })

    it('Deberia retornar 500 con ID inválido', async () => {
      const response = await request(app).get('/api/v1/products/invalid-id')
      expect(response.statusCode).toBe(500)
    })
  })
  describe('GET /api/v1/products/frontPage', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/products/frontPage')
      expect(response.statusCode).toBe(200)
    })
  })
  describe('GET /api/v1/seasons', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/seasons')
      expect(response.statusCode).toBe(200)
    })
  })
  describe('GET /api/v1/categories', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/categories')
      expect(response.statusCode).toBe(200)
    })
  })
  describe('Empleado intenta acceder a GET /api/v1/products/inventory', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test2@test.com',
        password: '123456'
      }

      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      // Nos aseguramos que el login fue exitoso y obtenemos el token
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      // Usamos el token del login para la petición a la ruta protegida
      const response = await request(app)
        .get('/api/v1/products/inventory')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('Cliente intenta acceder a GET /api/v1/products/inventory', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test1@test.com',
        password: '123456'
      }

      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      // Nos aseguramos que el login fue exitoso y obtenemos el token
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      // Usamos el token del login para la petición a la ruta protegida
      const response = await request(app)
        .get('/api/v1/products/inventory')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(403)
    })
  })
})
