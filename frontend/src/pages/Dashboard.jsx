// Dashboard del administrador - Vista general del sistema
import React from 'react'
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
      text: 'Ejemplo de gráfica de barras'
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data = {
  labels,
  datasets: [
    {
      label: 'Frutas',
      data: labels.map(() => Math.floor(Math.random() * 50)),
      backgroundColor: 'rgba(206, 255, 99, 1)'
    },
    {
      label: 'Verduras',
      data: labels.map(() => Math.floor(Math.random() * 50)),
      backgroundColor: 'rgba(97, 192, 75, 1)'
    },
    {
      label: 'Carnes',
      data: labels.map(() => Math.floor(Math.random() * 50)),
      backgroundColor: 'rgba(235, 53, 53, 1)'
    }
  ]
}

export const data2 = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.floor(Math.random() * 50)),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)'
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => Math.floor(Math.random() * 50)),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)'
    }
  ]
}

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <BackButton />
      <div className="dashboard-header">
        <h1>Dashboard del Administrador</h1>
        <p>Panel de control y estadísticas del sistema</p>
      </div>
      <section className="dashboard-content">
        <div className="graph-container">
          <Bar options={options} data={data} />
        </div>
        <div className="graph-container">
          <Line options={options2} data={data2} />
        </div>
        <div className="graph-container">
          <Bar options={options} data={data} />
        </div>
        <div className="graph-container">
          <Bar options={options} data={data} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
