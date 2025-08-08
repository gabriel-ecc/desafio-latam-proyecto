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

  // Limpiamos los mocks después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('GET /api/v1/products', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/products')
      expect(response.statusCode).toBe(200)
    })
    it('Deberia retornar status 500 si ocurre un error en el modelo', async () => {
      jest.spyOn(productsModel, 'getProductsByPage').mockRejectedValue(mockError)
      jest.spyOn(productsModel, 'getProductsCount').mockRejectedValue(mockError)

      const response = await request(app).get('/api/v1/products')
      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({
        error: mockError.message
      })
    })
    it('Debería retornar status 200 con HATEOAS', async () => {
      const mockProducts = [{
        id: 1,
        name: 'Producto 1'
      }]
      const mockCount = 1
      const mockHATEOAS = {
        total: mockCount,
        results: mockProducts
      }
      jest.spyOn(productsModel, 'getProductsByPage').mockResolvedValue(mockProducts)
      jest.spyOn(productsModel, 'getProductsCount').mockResolvedValue(mockCount)
      jest.spyOn(productsModel, 'productsHATEOAS').mockResolvedValue(mockHATEOAS)

      const response = await request(app)
        .get('/api/v1/products?page=1&limits=2')

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(mockHATEOAS)
    })
  })

  // --- Pruebas para /products/frontPage ---
  describe('GET /api/v1/products/frontPage', () => {
    it('Deberia retornar status 200', async () => {
      const response = await request(app).get('/api/v1/products/frontPage')
      expect(response.statusCode).toBe(200)
    })
    it('Deberia retornar status 500 si ocurre un error en el modelo', async () => {
      jest.spyOn(productsModel, 'getProductsFrontPage').mockRejectedValue(mockError)
      const response = await request(app).get('/api/v1/products/frontPage')

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({
        error: mockError.message
      })
    })
  })

  // --- Pruebas para /seasons y /categories ---
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

  // --- Pruebas para /products/inventory (ruta protegida) ---
  describe('GET /api/v1/products/inventory', () => {
    it('El empleado debería retornar status 200', async () => {
      const response = await request(app)
        .get('/api/v1/products/inventory')
        .set('Authorization', `Bearer ${loginTokenAdmin}`)
      expect(response.statusCode).toBe(200)
    })

    it('El cliente debería retornar status 403', async () => {
      const response = await request(app)
        .get('/api/v1/products/inventory')
        .set('Authorization', `Bearer ${loginTokenClient}`)
      expect(response.statusCode).toBe(403)
    })
  })
})
