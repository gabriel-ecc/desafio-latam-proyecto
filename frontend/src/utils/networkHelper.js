// Utilidades para manejo de red y diagnóstico de conectividad
import axios from 'axios'
import { ENDPOINT } from '../config/constants.js'

// Configurar interceptor para manejar errores de red globalmente
export const setupNetworkInterceptors = () => {
  // Interceptor para requests
  axios.interceptors.request.use(
    (config) => {
      console.log(`Making request to: ${config.url}`)
      return config
    },
    (error) => {
      console.error('Request error:', error)
      return Promise.reject(error)
    }
  )

  // Interceptor para responses
  axios.interceptors.response.use(
    (response) => {
      console.log(`Response from ${response.config.url}:`, response.status)
      return response
    },
    (error) => {
      console.error('Response error:', error)
      
      if (error.code === 'NETWORK_ERROR') {
        console.error('Network error detected - backend may be unreachable')
      } else if (error.response) {
        console.error('HTTP error:', error.response.status, error.response.data)
      }
      
      return Promise.reject(error)
    }
  )
}

// Test de conectividad específico
export const testBackendConnectivity = async () => {
  const tests = [
    { name: 'Products endpoint', url: ENDPOINT.products },
    { name: 'Orders endpoint', url: ENDPOINT.orders },
    { name: 'Categories endpoint', url: ENDPOINT.categories }
  ]

  const results = []

  for (const test of tests) {
    try {
      const response = await axios.get(test.url, { timeout: 5000 })
      results.push({
        name: test.name,
        status: 'success',
        httpStatus: response.status,
        url: test.url
      })
    } catch (error) {
      results.push({
        name: test.name,
        status: 'failed',
        error: error.message,
        code: error.code,
        url: test.url
      })
    }
  }

  return results
}

// Verificar si hay problemas de CORS
export const checkCorsIssues = async () => {
  try {
    const response = await fetch(ENDPOINT.products, {
      method: 'HEAD',
      mode: 'cors'
    })
    return { hasCorsIssues: false, status: response.status }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('CORS')) {
      return { hasCorsIssues: true, error: error.message }
    }
    return { hasCorsIssues: false, error: error.message }
  }
}

// Diagnóstico completo de red
export const runNetworkDiagnostics = async () => {
  console.log('🔍 Running network diagnostics...')
  
  const results = {
    timestamp: new Date().toISOString(),
    onlineStatus: navigator.onLine,
    baseUrl: ENDPOINT.products.split('/api/')[0],
    userAgent: navigator.userAgent,
    tests: {}
  }

  // Test básico de conectividad
  results.tests.connectivity = await testBackendConnectivity()
  
  // Test de CORS
  results.tests.cors = await checkCorsIssues()

  console.log('🔍 Network diagnostics complete:', results)
  return results
}

export default {
  setupNetworkInterceptors,
  testBackendConnectivity,
  checkCorsIssues,
  runNetworkDiagnostics
}
