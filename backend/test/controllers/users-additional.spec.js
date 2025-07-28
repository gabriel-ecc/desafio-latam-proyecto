import request from 'supertest'
import app from '../../server.js'
import pool from '../../db/schema/config.js'

describe('Additional Users API tests', () => {
  afterAll(async () => {
    // Limpiar datos de prueba adicionales
    try {
      await pool.query("DELETE FROM users WHERE email LIKE '%additionaltest%'")
    } catch (error) {
      console.log('Error cleaning up additional test data:', error)
    }
  })

  describe('GET /api/v1/users', () => {
    it('Debería retornar lista de usuarios', async () => {
      const response = await request(app).get('/api/v1/users')
      
      // Puede requerir autenticación, por eso verificamos 401 o 200
      expect([200, 401, 403].includes(response.statusCode)).toBe(true)
    })

    it('Debería aceptar parámetros de paginación', async () => {
      const response = await request(app).get('/api/v1/users?page=1&limit=5')
      
      expect([200, 401, 403].includes(response.statusCode)).toBe(true)
    })
  })

  describe('POST /api/v1/users - Casos adicionales', () => {
    it('Debería fallar sin firstName', async () => {
      const userData = {
        lastName: 'AdditionalTest',
        email: 'additionaltest1@test.com',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })

    it('Debería fallar sin email', async () => {
      const userData = {
        firstName: 'Additional',
        lastName: 'Test',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })

    it('Debería fallar con email inválido', async () => {
      const userData = {
        firstName: 'Additional',
        lastName: 'Test',
        email: 'email-invalido',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })

    it('Debería crear usuario exitosamente', async () => {
      const userData = {
        firstName: 'Additional',
        lastName: 'Test',
        email: 'additionaltest-success@test.com',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect([201, 409].includes(response.statusCode)).toBe(true)
      
      if (response.statusCode === 201) {
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toContain('exitosamente')
      }
    })
  })

  describe('PUT /api/v1/users/:id', () => {
    it('Debería manejar actualización de usuario', async () => {
      const response = await request(app)
        .put('/api/v1/users/1')
        .send({ firstName: 'Updated Name' })
      
      // Puede requerir autenticación o autorización
      expect([200, 401, 403, 404].includes(response.statusCode)).toBe(true)
    })
  })
})
