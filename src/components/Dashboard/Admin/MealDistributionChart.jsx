import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);


// Updated to accept dynamic data as props
export const MealDistributionChart = ({ data }) => {
  const theme = useTheme();

  // Helper function to get the short name of a day
  const getDayShortName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Generate labels for past 6 days, today, and tomorrow (8 days)
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    if (i === 0) {
      labels.push(getDayShortName(date) + ' (Today)');
    } else {
      labels.push(getDayShortName(date));
    }
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  labels.push(getDayShortName(tomorrow) + ' (Tomorrow)');

  // Find the maximum value in all datasets
  let maxValue = 0;
  if (Array.isArray(data.datasets)) {
    data.datasets.forEach(ds => {
      if (Array.isArray(ds.data)) {
        const localMax = Math.max(...ds.data);
        if (localMax > maxValue) maxValue = localMax;
      }
    });
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue + 3,
        ticks: {
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return '';
          },
          stepSize: 1,
        },
      },
    },
  };

  const chartData = {
    labels: labels,
    datasets:
      Array.isArray(data.datasets) && data.datasets.length > 0
        ? data.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data || [],
          }))
        : [],
  };

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
      className="p-6 rounded-lg"
    >
      <h2
        className="mb-2 text-xl font-semibold"
        style={{ color: theme.palette.text.primary }}
      >
        Meal Distribution
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: theme.palette.text.secondary }}
      >
        Weekly meal service trends
      </p>
      <Line options={options} data={chartData} />
    </div>
  );
};
