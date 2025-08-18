// Script para probar los nuevos endpoints de AdminPurchases
const axios = require('axios')

const URLBASE = 'http://localhost:3000/api/v1'

// Ejemplo de token (reemplazar con uno válido de empleado o admin)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Token de ejemplo

async function testAdminEndpoints() {
  console.log('🧪 Probando endpoints de AdminPurchases...\n')

  try {
    // 1. Probar obtener todas las compras
    console.log('1. Probando GET /orders/all')
    const allPurchasesResponse = await axios.get(`${URLBASE}/orders/all`, {
      headers: { Authorization: `Bearer ${testToken}` }
    })
    console.log(`✅ GET /orders/all - Status: ${allPurchasesResponse.status}`)
    console.log(`   Compras encontradas: ${allPurchasesResponse.data.length}\n`)

    if (allPurchasesResponse.data.length > 0) {
      const firstOrder = allPurchasesResponse.data[0]

      // 2. Probar obtener detalles de una compra
      console.log(`2. Probando GET /orders/all/detail/${firstOrder.id}`)
      const detailResponse = await axios.get(
        `${URLBASE}/orders/all/detail/${firstOrder.id}`,
        {
          headers: { Authorization: `Bearer ${testToken}` }
        }
      )
      console.log(
        `✅ GET /orders/all/detail/${firstOrder.id} - Status: ${detailResponse.status}`
      )
      console.log(
        `   Productos en la orden: ${detailResponse.data.purchasesDetail.length}\n`
      )

      // 3. Probar actualizar estado de pedido
      console.log(`3. Probando PUT /orders/${firstOrder.id}/status`)
      const updateResponse = await axios.put(
        `${URLBASE}/orders/${firstOrder.id}/status`,
        { order_status: 2 }, // Cambiar a "Retiro en Tienda"
        {
          headers: { Authorization: `Bearer ${testToken}` }
        }
      )
      console.log(
        `✅ PUT /orders/${firstOrder.id}/status - Status: ${updateResponse.status}`
      )
      console.log(`   Mensaje: ${updateResponse.data.message}\n`)
    }

    console.log('🎉 Todos los endpoints funcionan correctamente!')
  } catch (error) {
    console.error('❌ Error probando endpoints:')
    if (error.response) {
      console.error(`   Status: ${error.response.status}`)
      console.error(
        `   Message: ${error.response.data.message || error.response.data}`
      )
    } else {
      console.error(`   Error: ${error.message}`)
    }
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  console.log('ℹ️  Para probar estos endpoints, necesitas:')
  console.log('   1. Un token válido de empleado o administrador')
  console.log('   2. Reemplazar el testToken en la línea 6')
  console.log('   3. Ejecutar: node test_admin_endpoints.js\n')

  // testAdminEndpoints();
}

module.exports = { testAdminEndpoints }
