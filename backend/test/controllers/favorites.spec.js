import request from 'supertest'
import app from '../../server.js'
import * as favoritesModels from '../../src/models/favoritesModels.js' // Corregido: Usar 'favoritesModels' en plural para consistencia

describe('API /favorites', () => {
  let loginToken
  let mockError

  // Preparamos el token del login antes de todas las pruebas
  beforeAll(async () => {
    const userData = {
      email: 'test1@test.com',
      password: '123456'
    }
    const loginResponse = await request(app)
      .post('/api/v1/login')
      .send(userData)
    loginToken = loginResponse.body.token
    mockError = new Error('Error de BD simulado')
    expect(loginResponse.statusCode).toBe(200)
    expect(loginToken).toBeDefined()
  })

  // Limpiamos los mocks después de cada prueba para evitar interferencias
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('PUT /api/v1/favorites/action', () => {
    it('Deberia retornar status 200 al agregar o actualizar un favorito', async () => {
      // No es necesario volver a loguearse aquí. Ya tenemos el token (arriba)
      const product = {
        productId: '7819805b-6b5d-48f8-a141-8442f1878b52'
      }

      const response = await request(app)
        .put('/api/v1/favorites/action')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(product)
      expect(response.statusCode).toBe(200)
    })

    // Prueba para el caso de actualizar un favorito existente
    it('Deberia retornar status 200 al actualizar un favorito existente', async () => {
      const existingProduct = {
        productId: '7819805b-6b5d-48f8-a141-8442f1878b52'
      }

      // Agregamos el producto, primero, para asegurarnos que existe
      await request(app)
        .put('/api/v1/favorites/action')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(existingProduct)

      // Intentamos agregarlo de nuevo :P
      const response = await request(app)
        .put('/api/v1/favorites/action')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(existingProduct)

      expect(response.statusCode).toBe(200)
    })

    it('Deberia retornar status 500 si ocurre un error en la base de datos (actionFavorite)', async () => {
      // Espiamos la funcion searchFavoriteSQL
      // y le decimos al error que rechace la promesa con el valor
      jest.spyOn(favoritesModels, 'searchFavoriteSQL').mockRejectedValue(mockError)

      const product = {
        productId: '11-111111-1'
      }

      const response = await request(app)
        .put('/api/v1/favorites/action')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(product)

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({}) // El cuerpo del error debe conincidir con lo que devuelve la API
    })
  })

  describe('GET /api/v1/favorites/product/:id', () => {
    it('Deberia retornar status 200 al obtener un favorito por ID', async () => {
      // No es necesario volver a loguearse
      const productId = '7819805b-6b5d-48f8-a141-8442f1878b52'

      const response = await request(app)
        .get('/api/v1/favorites/product/' + productId)
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })

    it('Deberia retornar status 500 si ocurre un error en la base de datos (getFavorite)', async () => {
      // Espiamos la funcion searchFavoriteSQL
      // y le decimos al error que rechace la promesa con el valor
      jest.spyOn(favoritesModels, 'searchFavoriteSQL').mockRejectedValue(mockError)

      const productId = '11-111111-1'

      const response = await request(app)
        .get(`/api/v1/favorites/product/${productId}`)
        .set('Authorization', `Bearer ${loginToken}`)

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({})
    })
  })

  describe('GET /api/v1/favorites/my', () => {
    it('Deberia retornar status 200 al obtener la lista de favoritos paginada', async () => {
      // No es necesario volver a loguearse
      const response = await request(app)
        .get('/api/v1/favorites/my')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })

    it('Deberia retornar status 500 si ocurre un error en la base de datos (getFavoritesPaginated)', async () => {
      // Espiamos la funcion searchFavoriteSQL
      // y le decimos al error que rechace la promesa con el valor
      jest.spyOn(favoritesModels, 'getFavoritesSQL').mockRejectedValue(mockError)

      const response = await request(app)
        .get('/api/v1/favorites/my')
        .set('Authorization', `Bearer ${loginToken}`)
        .query({ page: 1, limits: 10 })

      expect(response.statusCode).toBe(500)
      expect(response.body).toEqual({})
    })
  })
})
