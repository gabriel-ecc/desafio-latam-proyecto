// Configuración de API para diferentes entornos
const getApiUrl = () => {
  // En desarrollo, usar localhost si está disponible
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000'
  }
  
  // En producción, siempre usar Azure
  return import.meta.env.VITE_API_URL || 'https://gatadecampobackend-f5febsb9b3btaqfc.chilecentral-01.azurewebsites.net'
}

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  VERSION: '/api/v1',
  TIMEOUT: 10000, // 10 segundos de timeout
  RETRY_ATTEMPTS: 3
}

// Debug logs
console.log('🔧 Environment:', import.meta.env.MODE)
console.log('🔧 API URL:', API_CONFIG.BASE_URL)

export default API_CONFIG
