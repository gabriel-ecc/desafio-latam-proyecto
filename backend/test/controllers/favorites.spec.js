import request from 'supertest'
import app from '../../server.js'

describe('API /favorites', () => {
  describe('PUT /api/v1/favorites/action', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test1@test.com',
        password: '123456'
      }
      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      const product = {
        productId: '7819805b-6b5d-48f8-a141-8442f1878b52'
      }

      const response = await request(app)
        .put('/api/v1/favorites/action')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(product)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('GET /api/v1/favorites/product/:id', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test1@test.com',
        password: '123456'
      }
      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      const productId = '7819805b-6b5d-48f8-a141-8442f1878b52'

      const response = await request(app)
        .get('/api/v1/favorites/product/' + productId)
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('GET /api/v1/favorites/my', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test1@test.com',
        password: '123456'
      }
      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      const response = await request(app)
        .get('/api/v1/favorites/my')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })
  })
})
