import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyChart = ({ data, loading, title }) => {
    console.log("Data en el Grafico: " + data);
    if (loading) return <div className="text-center py-4">Cargando gráfico...</div>;
    if (!data || data.length === 0) return <div className="text-center py-4 text-gray-500">No hay datos históricos</div>;
  // Procesar datos para el gráfico
  const chartData = {
    labels: data.map(item => item.mes),
    datasets: [
      {
        label: 'Total Devengado ($)',
        data: data.map(item => item.total),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true,
        text: 'Total Devengado por Mes',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString('es-ES')}`
        }
      }
    }
  };

  return (
    <div className="relative">
      <Bar data={chartData} options={options} />
      <h4 className="text-center mt-4 text-sm text-gray-600">{title}</h4>
    </div>
  );
};


export default MonthlyChart;