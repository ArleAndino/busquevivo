'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function PrecisionChart() {
  const data = {
    labels: ['Alertas Correctas', 'Falsos Positivos'],
    datasets: [{ data: [88, 12], backgroundColor: ['#66bb6a', '#ef5350'] }]
  };
  return <Doughnut data={data} />;
}
