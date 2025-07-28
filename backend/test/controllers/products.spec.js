import request from 'supertest'
import app from '../../server.js'

describe('API /products', () => {
  describe('GET /api/v1/products', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/products')
      expect(response.statusCode).toBe(200)
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
