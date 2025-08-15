import {
  getDailySalesWeekly,
  getNewClientsWeekly,
  getInactiveClients,
  getTopSellingProductsDaily,
  getLowStockProducts
} from '../models/dashboardModel.js'

export const getDailySalesWeeklyController = async (req, res) => {
  try {
    const dailySalesData = await getDailySalesWeekly()

    // 1. Crear un arreglo de los últimos 7 días para asegurar que el gráfico tenga todos los puntos
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    // 2. Mapear los datos de la DB a un objeto para fácil acceso por fecha
    const dataMap = dailySalesData.reduce((acc, current) => {
      const dateKey = new Date(current.date).toISOString().split('T')[0]
      acc[dateKey] = Number(current.total_revenue)
      return acc
    }, {})

    // 3. Generar el dataset final, incluyendo días sin ventas con valor 0
    const dataset = last7Days.map((date) => ({
      date: new Date(date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
      total_revenue: dataMap[date] || 0
    }))

    if (dataset.length === 0) {
      return res.status(200).json({
        ok: true,
        data: [],
        message: 'No se encontraron ventas en la última semana.'
      })
    }

    return res.status(200).json({
      ok: true,
      data: dataset,
      message: 'Ventas diarias de la última semana obtenidas con éxito.'
    })
  } catch (error) {
    console.error('Error en getDailySalesWeeklyController:', error)
    return res.status(500).json({
      ok: false,
      message: 'Ha ocurrido un error en el servidor.',
      error: error.message
    })
  }
}

export const getNewClientsWeeklyController = async (req, res) => {
  try {
    const newClientsData = await getNewClientsWeekly()

    // Formateamos los datos para react-charts-2
    // Creamos un dataset que incluye todos los días de la semana (incluso si no hubo nuevos clientes)
    // y se transforma el formato de fecha para la presentación.

    // 1. Crear un arreglo de los últimos 7 días
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse() // Invertir el orden para que sea ascendente

    // 2. Mapeamos los datos de la DB a un objeto para fácil acceso
    const dataMap = newClientsData.reduce((acc, current) => {
      const dateKey = new Date(current.date).toISOString().split('T')[0]
      acc[dateKey] = Number(current.new_clients)
      return acc
    }, {})

    // 3. Generamos el dataset final
    const dataset = last7Days.map((date) => ({
      date: new Date(date).toLocaleDateString('es-CL', { month: 'short', day: 'numeric' }),
      new_clients: dataMap[date] || 0
    }))

    if (dataset.length === 0) {
      return res.status(200).json({
        ok: true,
        data: [],
        message: 'No se encontraron nuevos clientes en la última semana.'
      })
    }

    return res.status(200).json({
      ok: true,
      data: dataset,
      message: 'Nuevos clientes de la última semana obtenidos con éxito.'
    })
  } catch (error) {
    console.error('Error en getNewClientsWeeklyController:', error)
    return res.status(500).json({
      ok: false,
      message: 'Ha ocurrido un error en el servidor.',
      error: error.message
    })
  }
}

export const getInactiveClientsController = async (req, res) => {
  try {
    const inactiveClientsCount = await getInactiveClients()

    if (!inactiveClientsCount) {
      return res.status(200).json({
        ok: true,
        data: { inactive_clients_count: 0 },
        message: 'No se encontraron clientes inactivos.'
      })
    }

    return res.status(200).json({
      ok: true,
      data: inactiveClientsCount,
      message: 'Conteo de clientes inactivos obtenido con éxito.'
    })
  } catch (error) {
    console.error('Error in getInactiveClientsController:', error)
    return res.status(500).json({
      ok: false,
      message: 'Ha ocurrido un error en el servidor.',
      error: error.message
    })
  }
}

export const getTopSellingProductsDailyController = async (req, res) => {
  try {
    const topProducts = await getTopSellingProductsDaily()

    if (topProducts.length === 0) {
      return res.status(200).json({
        ok: true,
        data: [],
        message: 'No se encontraron ventas de productos para el día de hoy.'
      })
    }

    return res.status(200).json({
      ok: true,
      data: topProducts,
      message: 'Productos más vendidos del día obtenidos con éxito.'
    })
  } catch (error) {
    console.error('Error in getTopSellingProductsDailyController:', error)
    return res.status(500).json({
      ok: false,
      message: 'Ha ocurrido un error en el servidor.',
      error: error.message
    })
  }
}

export const getLowStockProductsController = async (req, res) => {
  try {
    const lowStockProducts = await getLowStockProducts()

    if (lowStockProducts.length === 0) {
      return res.status(200).json({
        ok: true,
        data: [],
        message: 'No se encontraron productos con stock bajo.'
      })
    }

    return res.status(200).json({
      ok: true,
      data: lowStockProducts,
      message: 'Productos con stock bajo obtenidos con éxito.'
    })
  } catch (error) {
    console.error('Error in getLowStockProductsController:', error)
    return res.status(500).json({
      ok: false,
      message: 'Ha ocurrido un error en el servidor.',
      error: error.message
    })
  }
}
