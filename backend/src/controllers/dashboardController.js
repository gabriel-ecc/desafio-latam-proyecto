import { getDailySales } from '../../src/models/dashboardModel.js'

export const getDailySalesController = async (req, res) => {
  try {
    const dailySalesData = await getDailySales()

    if (!dailySalesData) {
      return res.status(404).json({
        ok: false,
        message: 'No hubo ventas el día de hoy'
      })
    }

    return res.status(200).json({
      ok: true,
      data: dailySalesData,
      message: 'Ventas del día obtenidas correctamente'
    })
  } catch (error) {
    console.error('Error en getDailySalesController', error)
    return res.status(500).json({
      ok: false,
      message: 'Error en el servidor',
      error: error.message
    })
  }
}
