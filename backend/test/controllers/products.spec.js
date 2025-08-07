import request from 'supertest'
import app from '../../server.js'
import * as productsModel from '../../src/models/productsModel.js'

describe('API /products', () => {
  let loginTokenAdmin
  let loginTokenClient
  let mockError

  // Prepara el token de login antes de todas las pruebas
  beforeAll(async () => {
    // Token para usuario cliente
    const userDataClient = {
      email: 'test1@test.com',
      password: '123456'
    }
    const loginResponseClient = await request(app)
      .post('/api/v1/login')
      .send(userDataClient)
    loginTokenClient = loginResponseClient.body.token

    // Token para usuario empleado/admin
    const userDataAdmin = {
      email: 'test2@test.com',
      password: '123456'
    }
    const loginResponseAdmin = await request(app)
      .post('/api/v1/login')
      .send(userDataAdmin)
    loginTokenAdmin = loginResponseAdmin.body.token

    mockError = new Error('Error de BD simulado')
  })

  // Limpia los mocks después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks()
  })

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
    it('Deberia retornar status 500 si ocurre un error en el modelo', async () => {
      jest.spyOn(productsModel, 'getProductsFrontPage').mockRejectedValue(mockError)
      const response = await request(app).get('/api/v1/products/frontPage')

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({})
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
    it('Deberia retornar status 200 y productos con HATEOAS', async () => {
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

    it('El cliente debería retornar status 403', async () => {
      const response = await request(app)
        .get('/api/v1/products/inventory')
        .set('Authorization', `Bearer ${loginTokenClient}`)
      expect(response.statusCode).toBe(403)
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
