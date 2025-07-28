import request from 'supertest'
import app from '../../server.js'
import pool from '../../db/schema/config.js'

describe('API /auth', () => {
  beforeAll(async () => {
    // Asegurar que existe un usuario de prueba
    const testUser = {
      firstName: 'Auth',
      lastName: 'Test',
      email: 'authtest-unique@test.com',
      phone: '987654321',
      password: '123456',
      userType: 1
    }
    
    try {
      const response = await request(app).post('/api/v1/users').send(testUser)
      console.log('User creation response:', response.status)
    } catch (error) {
      console.log('User creation error:', error.message)
    }
  })

  afterAll(async () => {
    // Limpiar datos de prueba
    try {
      await pool.query("DELETE FROM users WHERE email = 'authtest-unique@test.com'")
    } catch (error) {
      console.log('Error cleaning up test data:', error)
    }
  })

  describe('POST /api/v1/login', () => {
    it('Debería retornar status 200 con credenciales válidas', async () => {
      const loginData = {
        email: 'authtest-unique@test.com',
        password: '123456'
      }

      const response = await request(app)
        .post('/api/v1/login')
        .send(loginData)

      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
      expect(response.body).toHaveProperty('token')
    })

    it('Debería retornar status 401 con email incorrecto', async () => {
      const loginData = {
        email: 'inexistente-unique@test.com',
        password: '123456'
      }

      const response = await request(app)
        .post('/api/v1/login')
        .send(loginData)

      expect(response.statusCode).toBe(401)
      expect(response.body).toHaveProperty('message', 'Email o Contraseña incorrecta')
    })
  })
})
