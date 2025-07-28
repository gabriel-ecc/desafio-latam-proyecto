/* eslint-env jest */
import { loginUser } from '../../src/controllers/authController.js'
import { findUserByEmailModel } from '../../src/models/usersModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock de las dependencias
jest.mock('../../src/models/usersModel.js')
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('AuthController - loginUser', () => {
  let req, res

  beforeEach(() => {
    // Setup de request y response mock
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks()
  })

  describe('Casos exitosos', () => {
    test('Debería hacer login exitoso con credenciales válidas', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 1
      }
      const mockToken = 'mockTokenValue'

      findUserByEmailModel.mockResolvedValue(mockUser)
      bcrypt.compareSync.mockReturnValue(true)
      jwt.sign.mockReturnValue(mockToken)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('test@example.com')
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'password123',
        'hashedPassword'
      )
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ token: mockToken })
    })
  })

  describe('Casos de error - Usuario no encontrado', () => {
    test('Debería retornar 401 cuando el usuario no existe', async () => {
      // Arrange
      findUserByEmailModel.mockResolvedValue(null)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('test@example.com')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
      expect(bcrypt.compareSync).not.toHaveBeenCalled()
      expect(jwt.sign).not.toHaveBeenCalled()
    })

    test('Debería retornar 401 cuando el usuario es undefined', async () => {
      // Arrange
      findUserByEmailModel.mockResolvedValue(undefined)

      // Act
      await loginUser(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
    })
  })

  describe('Casos de error - Usuario bloqueado', () => {
    test('Debería retornar 403 cuando el usuario está bloqueado (status = 0)', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 0
      }

      findUserByEmailModel.mockResolvedValue(mockUser)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('test@example.com')
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario bloqueado'
      })
      expect(bcrypt.compareSync).not.toHaveBeenCalled()
      expect(jwt.sign).not.toHaveBeenCalled()
    })
  })

  describe('Casos de error - Contraseña incorrecta', () => {
    test('Debería retornar 401 cuando la contraseña es incorrecta', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 1
      }

      findUserByEmailModel.mockResolvedValue(mockUser)
      bcrypt.compareSync.mockReturnValue(false)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('test@example.com')
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        'password123',
        'hashedPassword'
      )
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
      expect(jwt.sign).not.toHaveBeenCalled()
    })
  })

  describe('Casos de error - Errores de servidor', () => {
    test('Debería retornar 500 cuando findUserByEmailModel lanza una excepción', async () => {
      // Arrange
      const mockError = new Error('Database connection error')
      findUserByEmailModel.mockRejectedValue(mockError)

      // Spy en console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('test@example.com')
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
      expect(consoleSpy).toHaveBeenCalledWith(mockError)

      // Limpiar el spy
      consoleSpy.mockRestore()
    })

    test('Debería retornar 500 cuando bcrypt.compareSync lanza una excepción', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 1
      }
      const mockError = new Error('Bcrypt error')

      findUserByEmailModel.mockResolvedValue(mockUser)
      bcrypt.compareSync.mockImplementation(() => {
        throw mockError
      })

      // Spy en console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await loginUser(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
      expect(consoleSpy).toHaveBeenCalledWith(mockError)

      // Limpiar el spy
      consoleSpy.mockRestore()
    })

    test('Debería retornar 500 cuando jwt.sign lanza una excepción', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 1
      }
      const mockError = new Error('JWT error')

      findUserByEmailModel.mockResolvedValue(mockUser)
      bcrypt.compareSync.mockReturnValue(true)
      jwt.sign.mockImplementation(() => {
        throw mockError
      })

      // Spy en console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await loginUser(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
      expect(consoleSpy).toHaveBeenCalledWith(mockError)

      // Limpiar el spy
      consoleSpy.mockRestore()
    })
  })

  describe('Casos edge - Datos de entrada', () => {
    test('Debería manejar email vacío', async () => {
      // Arrange
      req.body.email = ''
      findUserByEmailModel.mockResolvedValue(null)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith('')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
    })

    test('Debería manejar password vacío', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        user_status: 1
      }

      req.body.password = ''
      findUserByEmailModel.mockResolvedValue(mockUser)
      bcrypt.compareSync.mockReturnValue(false)

      // Act
      await loginUser(req, res)

      // Assert
      expect(bcrypt.compareSync).toHaveBeenCalledWith('', 'hashedPassword')
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
    })

    test('Debería manejar body sin email ni password', async () => {
      // Arrange
      req.body = {}
      findUserByEmailModel.mockResolvedValue(null)

      // Act
      await loginUser(req, res)

      // Assert
      expect(findUserByEmailModel).toHaveBeenCalledWith(undefined)
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email o Contraseña incorrecta'
      })
    })
  })
})
