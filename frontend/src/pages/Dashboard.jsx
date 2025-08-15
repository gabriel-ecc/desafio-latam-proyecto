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
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import Swal from 'sweetalert2' // Importar Swal para el SweetAlert

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
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
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart'
    }
  }
}

// Inicializar el objeto de datos del gráfico con una estructura válida
export const initialDataGraph = {
  labels: [],
  datasets: [
    {
      label: 'Ventas Diarias',
      data: [],
      backgroundColor: '#1e7c3a'
    }
  ]
}

export default function Dashboard() {
  const [dailySalesWeeklyData, setDailySalesWeeklyData] = useState([])
  const [dataGraph1, setDataGraph1] = useState(initialDataGraph) // Inicializar con la estructura de datos correcta

  const token = getToken()
  // Asumiendo que `navigate` y `setLoading` se importan o definen en otra parte del código
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDailySalesWeeklyData = async () => {
      // Validar el token antes de la llamada a la API
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

      try {
        const response = await axios.get(ENDPOINT.dailySalesWeekly, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setDailySalesWeeklyData(response.data.data)

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
      } finally {
        // setLoading(false)
      }
    }
    fetchDailySalesWeeklyData()
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
          <Bar options={options} data={dataGraph1} />
        </div>
      </section>
    </div>
  )
}
