import React, { useState, useEffect } from 'react';
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
import {
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { getAuthHeader } from '../../../utils/authHeader';
import { BASE_URLS } from '../../../services/api/config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const DistributionChart = () => {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('services');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get the short name of a day
  const getDayShortName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Generate labels for past 6 days, today, and Next Day (8 days) based on selected date
  const generateLabels = () => {
    const labels = [];
    const baseDate = new Date(selectedDate);

    // Generate 7 days: 6 days before selected date + selected date
    for (let i = 6; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i);
      if (i === 0) {
        labels.push(getDayShortName(date) + ' (Selected)');
      } else {
        labels.push(getDayShortName(date));
      }
    }

    // Add next day
    const nextDay = new Date(baseDate);
    nextDay.setDate(baseDate.getDate() + 1);
    labels.push(getDayShortName(nextDay) + ' (Next Day)');

    return labels;
  };

  // Fetch data based on filter type and selected date
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let endpoint = '';
        switch (filterType) {
          case 'meals':
            endpoint = `${BASE_URLS.dashboardAdmin}/mealdistribution?date=${selectedDate}`;
            break;
          case 'assets':
            endpoint = `${BASE_URLS.dashboardAdmin}/assetdistribution?date=${selectedDate}`;
            break;
          case 'services':
            endpoint = `${BASE_URLS.dashboardAdmin}/servicesdistribution?date=${selectedDate}`;
            break;
          default:
            endpoint = `${BASE_URLS.dashboardAdmin}/mealdistribution?date=${selectedDate}`;
        }

        const response = await axios.get(endpoint, {
          headers: { ...getAuthHeader() },
        });

        setData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setData({ labels: [], datasets: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterType, selectedDate]);

  const getChartTitle = () => {
    switch (filterType) {
      case 'meals':
        return 'Meal Distribution';
      case 'assets':
        return 'Asset Distribution';
      case 'services':
        return 'Service Distribution';
      default:
        return 'Distribution Chart';
    }
  };

  const getChartDescription = () => {
    switch (filterType) {
      case 'meals':
        return `Weekly meal request trends for the period centered on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'assets':
        return `Weekly asset request trends for the period centered on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'services':
        return `Weekly service request trends for the period centered on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default:
        return 'Weekly trends';
    }
  };

  // Find the maximum value in all datasets
  let maxValue = 0;
  if (Array.isArray(data.datasets)) {
    data.datasets.forEach((ds) => {
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
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function (tooltipItems) {
            const label = tooltipItems[0].label;
            const typeText =
              filterType === 'meals'
                ? 'Meal Requests'
                : filterType === 'assets'
                  ? 'Asset Requests'
                  : 'Service Requests';
            return `${typeText} - ${label}`;
          },
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            const unit =
              filterType === 'meals'
                ? 'meal'
                : filterType === 'assets'
                  ? 'asset'
                  : 'service';
            return `${label}: ${value} ${unit}${value !== 1 ? 's' : ''}`;
          },
          footer: function (tooltipItems) {
            const total = tooltipItems.reduce(
              (sum, item) => sum + item.parsed.y,
              0,
            );
            const unit =
              filterType === 'meals'
                ? 'meal'
                : filterType === 'assets'
                  ? 'asset'
                  : 'service';
            return `Total: ${total} ${unit}${total !== 1 ? 's' : ''} on this day`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue + 3,
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
            return '';
          },
          stepSize: 1,
        },
        title: {
          display: true,
          text:
            filterType === 'meals'
              ? 'Number of Meals'
              : filterType === 'assets'
                ? 'Asset Requests'
                : 'Service Requests',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date Range (7 days)',
        },
      },
    },
  };

  const chartData = {
    labels: data.labels || generateLabels(),
    datasets:
      Array.isArray(data.datasets) && data.datasets.length > 0
        ? data.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data || [],
          }))
        : [],
  };

  if (loading) {
    return (
      <div
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="p-6 rounded-lg"
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        className="p-6 rounded-lg"
      >
        <div style={{ color: theme.palette.error.main }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
      }}
      className="p-6 rounded-lg"
    >
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            className="mb-2 text-xl font-semibold"
            style={{ color: theme.palette.text.primary }}
          >
            {getChartTitle()}
          </h2>
          <p
            className="text-sm"
            style={{ color: theme.palette.text.secondary }}
          >
            {getChartDescription()}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-3">
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
              style={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <MenuItem value="meals">Meals</MenuItem>
              <MenuItem value="assets">Assets</MenuItem>
              <MenuItem value="services">Services</MenuItem>
            </Select>
          </FormControl>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-sm border rounded"
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4">
        <Line options={options} data={chartData} />
      </div>

      {/* Data Insights */}
      {data.datasets && data.datasets.length > 0 && (
        <div
          className="pt-4 mt-4 border-t"
          style={{ borderColor: theme.palette.divider }}
        >
          <h4
            className="mb-2 text-sm font-medium"
            style={{ color: theme.palette.text.primary }}
          >
            Weekly Insights
          </h4>
          <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-4">
            {data.datasets.map((dataset, index) => {
              const total = dataset.data.reduce((sum, val) => sum + val, 0);
              const average = (total / dataset.data.length).toFixed(1);
              const peak = Math.max(...dataset.data);
              const peakDay = data.labels[dataset.data.indexOf(peak)];

              return (
                <div
                  key={index}
                  className="p-2 rounded"
                  style={{
                    background: theme.palette.background.default,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <div
                    className="mb-1 font-medium"
                    style={{ color: dataset.borderColor }}
                  >
                    {dataset.label}
                  </div>
                  <div style={{ color: theme.palette.text.secondary }}>
                    Weekly Total: {total} | Avg: {average}/day
                  </div>
                  <div style={{ color: theme.palette.text.secondary }}>
                    Peak: {peak} on {peakDay}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
