import request from 'supertest'
import app from '../../server.js'

describe('API /users', () => {
  describe('POST /api/v1/users', () => {
    it('Deberia retornar status 201', async () => {
      const userData = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(201)
    })
  })
  describe('Mismo POST /api/v1/users', () => {
    it('Deberia retornar status 409', async () => {
      const userData = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(409)
    })
  })
  describe('Incompleto POST /api/v1/users', () => {
    it('Deberia retornar status 409', async () => {
      const userData = {
        firstName: 'test',
        lastName: null,
        email: 'test@test.com',
        phone: '123456789',
        password: '123456',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('Password corta POST /api/v1/users', () => {
    it('Deberia retornar status 409', async () => {
      const userData = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        phone: '123456789',
        password: '1234',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('Correo no valido POST /api/v1/users', () => {
    it('Deberia retornar status 409', async () => {
      const userData = {
        firstName: 'test',
        lastName: 'test',
        email: 'test@test',
        phone: '123456789',
        password: '1234',
        userType: 1
      }

      const response = await request(app).post('/api/v1/users').send(userData)
      expect(response.statusCode).toBe(400)
    })
  })
})
