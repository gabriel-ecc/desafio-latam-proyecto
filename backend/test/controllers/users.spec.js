import request from 'supertest'
import app from '../../server.js'
import pool from '../../db/schema/config.js'

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
      expect(response.type).toBe('application/json')
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
  describe('Login cliente POST /api/v1/login', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'test1@test.com',
        password: '123456'
      }

      const response = await request(app).post('/api/v1/login').send(userData)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('Empleado intenta obtiene a GET /api/v1/users', () => {
    it('Deberia retornar status 200', async () => {
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
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('Empleado intenta obtiene a GET /api/v1/users/employee', () => {
    it('Deberia retornar status 200', async () => {
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
        .get('/api/v1/users/employee')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(403)
    })
  })
  describe('Empleado intenta obtiene a GET /api/v1/users/employee', () => {
    it('Deberia retornar status 200', async () => {
      const userData = {
        email: 'admin@verduleria.cl',
        password: 'admin1'
      }

      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)
      // Nos aseguramos que el login fue exitoso y obtenemos el token
      expect(loginResponse.statusCode).toBe(200)
      const loginToken = loginResponse.body.token

      // Usamos el token del login para la petición a la ruta protegida
      const response = await request(app)
        .get('/api/v1/users/employee')
        .set('Authorization', `Bearer ${loginToken}`)
      expect(response.statusCode).toBe(200)
    })
  })
  describe('PUT /api/v1/users/lock/:id', () => {
    it('Deberia retornar status 200', async () => {
      const userDataTest = {
        firstName: 'test',
        lastName: 'test',
        email: 'testb@test.com',
        phone: '123456789',
        password: '123456'
      }

      const responseCreate = await request(app)
        .post('/api/v1/users')
        .send(userDataTest)

      const userId = responseCreate.body.user.id

      const userData = {
        email: 'admin@verduleria.cl',
        password: 'admin1'
      }

      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userData)

      const loginToken = loginResponse.body.token

      const response = await request(app)
        .put('/api/v1/users/lock/' + userId)
        .set('Authorization', `Bearer ${loginToken}`)
      console.log(response.body.message)
      expect(response.statusCode).toBe(200)
    })
  })

  describe('PUT /api/v1/users/employee', () => {
    it('Deberia retornar status 200', async () => {
      const userAdminData = {
        email: 'admin@verduleria.cl',
        password: 'admin1'
      }
      const loginResponse = await request(app)
        .post('/api/v1/login')
        .send(userAdminData)

      const loginToken = loginResponse.body.token

      const employeeDataTest = {
        firstName: 'test',
        lastName: 'test',
        email: 'teste@test.com',
        phone: '123456789',
        password: '123456'
      }

      const response = await request(app)
        .post('/api/v1/users/employee')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(employeeDataTest)
      expect(response.statusCode).toBe(201)
    })
  })

  // Hook para limpiar la base de datos después de todas las pruebas
  afterAll(async () => {
    try {
      const queryText = "DELETE FROM users WHERE first_name = 'test'"
      const res = await pool.query(queryText)
      console.log(`Usuarios de prueba eliminados: ${res.rowCount}`)
    } catch (error) {
      console.error(
        'Error al limpiar los usuarios de prueba de la base de datos:',
        error
      )
    }
    // Cerramos la conexión a la base de datos para que Jest no se quede colgado
    await pool.end()
    console.log('Pool de conexiones cerrado.')
  })
})
