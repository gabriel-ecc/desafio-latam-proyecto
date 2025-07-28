import request from 'supertest'
import app from '../../server.js'

describe('API /categories', () => {
  describe('GET /api/v1/categories', () => {
    it('Debería retornar status 200 y lista de categorías', async () => {
      const response = await request(app)
        .get('/api/v1/categories')

      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('Debería retornar categorías con la estructura correcta', async () => {
      const response = await request(app)
        .get('/api/v1/categories')

      expect(response.statusCode).toBe(200)
      
      if (response.body.length > 0) {
        const category = response.body[0]
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
      }
    })
  })
})
