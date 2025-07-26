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
})

