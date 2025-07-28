import request from 'supertest'
import app from '../../server.js'

describe('API /seasons', () => {
  describe('GET /api/v1/seasons', () => {
    it('Debería retornar status 200 y lista de temporadas', async () => {
      const response = await request(app)
        .get('/api/v1/seasons')

      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
      expect(Array.isArray(response.body)).toBe(true)
    })

    it('Debería retornar temporadas con la estructura correcta', async () => {
      const response = await request(app)
        .get('/api/v1/seasons')

      expect(response.statusCode).toBe(200)
      
      if (response.body.length > 0) {
        const season = response.body[0]
        expect(season).toHaveProperty('id')
        expect(season).toHaveProperty('name')
      }
    })
  })
})
