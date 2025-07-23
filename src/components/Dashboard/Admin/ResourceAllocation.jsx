import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw}%`;
        },
      },
    },
  },
};

// Updated to accept dynamic data as props
export const ResourceAllocation = ({ data }) => {
  const theme = useTheme();

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.allocated),
        backgroundColor: [
          'rgb(59, 130, 246)', // Blue
          'rgb(16, 185, 129)', // Green
          'rgb(245, 158, 11)', // Amber
          'rgb(239, 68, 68)', // Red
          'rgb(124, 58, 237)', // Purple
          'rgb(236, 72, 153)', // Pink
          'rgb(14, 165, 233)', // Sky Blue
          'rgb(234, 88, 12)', // Orange
          'rgb(168, 85, 247)', // Violet
          'rgb(79, 70, 229)', // Indigo
          'rgb(20, 184, 166)', // Teal
          'rgb(251, 191, 36)', // Yellow
        ],
      },
    ],
  };

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // Removed justifyContent: 'center' to start content from top
        height: '100%',
      }}
      className="p-6 rounded-lg"
    >
      <h2
        className="mb-2 text-xl font-semibold"
        style={{ color: theme.palette.text.primary }}
      >
        Resource Allocation
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: theme.palette.text.secondary }}
      >
        Current resource distribution
      </p>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
