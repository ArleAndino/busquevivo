'use client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function AlertsTrend() {
  const data = {
    labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
    datasets: [
      { label: 'Alertas', data: [100,150,180,210,250,300], borderColor: '#388e3c', fill: false }
    ]
  };
  return <Line data={data} />;
}
