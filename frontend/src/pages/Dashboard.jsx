// Dashboard del administrador - Vista general del sistema
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ENDPOINT } from '../config/constants'
import { getToken } from '../services/authService'
import React from 'react'
import '../assets/variables.css'
import BackButton from '../components/BackButton'
import './Dashboard.css'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import Swal from 'sweetalert2' // Importar Swal para el SweetAlert

ChartJS.register(
  RadialLinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const options1 = {
  plugins: {
    title: {
      display: true,
      text: 'Ventas últimos 7 días'
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}
export const options2 = {
  plugins: {
    title: {
      display: true,
      text: 'Clientes registrados últimos 7 días'
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}
export const options3 = {
  plugins: {
    title: {
      display: true,
      text: 'Clientes inactivos últimos 7 días'
    }
  },
  responsive: true,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
}
export const options4 = {
  plugins: {
    title: {
      display: true,
      text: 'Top 10 productos vendidos en el día'
    }
  },
  responsive: true,
}

// Inicializar el objeto de datos del gráfico con una estructura válida
export const initialDataGraph1 = {
  labels: [],
  datasets: [
    {
      label: 'Ventas Diarias',
      data: [],
      backgroundColor: '#1e7c3a'
    }
  ]
}

export const initialDataGraph2 = {
  labels: [],
  datasets: [
    {
      label: 'Nuevos Clientes',
      data: [],
      backgroundColor: '#1e7c3a'
    }
  ]
}

export const initialDataGraph4 = {
  labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
  datasets: [
    {
      label: 'Top 10 Productos Vendidos',
      data: [2, 9, 3, 5, 2, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }
  ]
}

export default function Dashboard() {
  const [dataGraph1, setDataGraph1] = useState(initialDataGraph1)
  const [dataGraph2, setDataGraph2] = useState(initialDataGraph2)
  const [dataGraph4, setDataGraph4] = useState(initialDataGraph4)
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [inactiveClients, setInactiveClients] = useState([])

  const token = getToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para realizar esta acción.',
        icon: 'error',
        confirmButtonColor: '#dc3545'
      })
      navigate('/login')
      return
    }

    const fetchDailySalesWeeklyData = async () => {
      try {
        const response = await axios.get(ENDPOINT.dailySalesWeekly, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const labels = response.data.data.map(item => item.date)
        const totalRevenueData = response.data.data.map(
          item => item.total_revenue
        )
        setDataGraph1({
          labels,
          datasets: [
            {
              label: 'Ventas',
              data: totalRevenueData,
              backgroundColor: '#1e7c3a'
            }
          ]
        })
      } catch (error) {
        console.error('Error fetching daily sales weekly data:', error)
        setDataGraph1(initialDataGraph1) //restablecemos al estado inicial
      }
    }
    const fetchNewClientsWeeklyData = async () => {
      try {
        const response = await axios.get(ENDPOINT.newClientsWeekly, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const labels = response.data.data.map(item => item.date)
        const newClientsData = response.data.data.map(item => item.new_clients)
        setDataGraph2({
          labels,
          datasets: [
            {
              label: 'Nuevos Clientes',
              data: newClientsData,
              backgroundColor: '#1e7c3a'
            }
          ]
        })
      } catch (error) {
        console.error('Error obteniendo la informacion de los clientes:', error)
        setDataGraph2(initialDataGraph2)
      }
    }

    const fetchTopSellingProductsDailyData = async () => {
      const backgroundColors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 164, 0.6)',
            'rgba(12, 13, 140, 0.6)',
            'rgba(123, 234, 12, 0.6)'
        ];
      try {
        const response = await axios.get(ENDPOINT.topSellingProductsDaily, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log(response.data.data)
        const labels = response.data.data.map(item => item.product_name)
        const totalCount = response.data.data.map(item => item.total_sold)
        setDataGraph4({
          labels,
          datasets: [
            {
              label: 'Cantidad',
              data: totalCount,
              backgroundColor: backgroundColors
            }
          ]
        })
      } catch (error) {
        console.error('Error obteniendo la informacion de los productos mas vendidos:', error)
        setDataGraph4(initialDataGraph4)
      }
    }

    const fetchLowStockProductsData = async () => {
      try {
        const response = await axios.get(ENDPOINT.lowStockProducts, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Guardamos el array de productos directamente
        setLowStockProducts(response.data.data)
      } catch (error) {
        console.error('Error al obtener los productos con bajo stock', error)
      }
  }

    const fetchInactiveClientsData = async () => {
      try {
        const response = await axios.get(ENDPOINT.inactiveClients, {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Guardamos el array directamente
        setInactiveClients(response.data.data)
      } catch (error) {
        console.error('Error obteniendo la informacion de los clientes sin movimientos:', error)
      }
    }


    fetchDailySalesWeeklyData()
    fetchNewClientsWeeklyData()
    fetchInactiveClientsData()
    fetchTopSellingProductsDailyData()
    fetchLowStockProductsData()
  }, [])

  return (
    <div className="dashboard-container">
      <BackButton />
      <div className="dashboard-header">
        <h1>Dashboard del Administrador</h1>
        <p>Panel de control y estadísticas del sistema</p>
      </div>
      <section className="dashboard-content">
        <div className="graph-container">
          <Bar options={options1} data={dataGraph1} />
        </div>
        <div className="graph-container">
          <Bar options={options2} data={dataGraph2} />
        </div>
        <div className="graph-container">
          <Pie options={options4} data={dataGraph4} />
        </div>

        <div className="table-container">
          <h3>Productos con stock bajo</h3>
          {lowStockProducts.length > 0 ? (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Nombre del Producto</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {/* Iteramos sobre el array y creamos una fila por cada producto */}
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.product_name}</td>
                    <td>{product.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron productos con stock bajo en el inventario.</p>
          )}
        </div>

        <div className="table-container">
          <h3>Clientes inactivos el último mes</h3>
          {inactiveClients.length > 0 ? (
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Última Compra</th>
                </tr>
              </thead>
              <tbody>
                {inactiveClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.first_name} {client.last_name}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.last_purchase_date
                      ? new Date(client.last_purchase_date).toLocaleString()
                    : 'Sin compras realizadas'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron clientes sin movimientos el último mes</p>
          )}
        </div>
      </section>
    </div>
  )
}
