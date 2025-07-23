

import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { getAuthHeader } from '../../../utils/authHeader';
import { BASE_URLS } from '../../../services/api/config';
import { useTheme } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
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
];

const options = {
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          // Show label and count
          return `${tooltipItem.label}: ${tooltipItem.raw}`;
        },
      },
    },
  },
};



export const MealTypeDistribution = ({ date }) => {
  // If no date prop, use today in YYYY-MM-DD
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const initialDate = date || getToday();

  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URLS.dashboardAdmin}/mealtypedist?date=${selectedDate}`, {
        headers: { ...getAuthHeader() },
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      });
  }, [selectedDate]);

  if (loading) {
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
          Meal Type Distribution
        </h2>
        <div className="flex justify-end w-full mb-2">
          <input
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}
          />
        </div>
        <div>Loading meal type distribution...</div>
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
          Meal Type Distribution
        </h2>
        <div className="flex justify-end w-full mb-2">
          <input
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}
          />
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  let chartContent;
  if (!data || !data.data || data.data.length === 0) {
    chartContent = (
      <div className="flex items-center justify-center flex-1 text-gray-500" style={{ minHeight: 180 }}>
        No meal data for selected date.
      </div>
    );
  } else {
    const chartData = {
      labels: data.data.map((d) => d.mealtype),
      datasets: [
        {
          data: data.data.map((d) => d.count),
          backgroundColor: COLORS,
          borderWidth: 1,
        },
      ],
    };
    chartContent = <Doughnut data={chartData} options={options} />;
  }

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
        height: '100%',
      }}
      className="p-6 rounded-lg"
    >
      <h2
        className="mb-2 text-xl font-semibold"
        style={{ color: theme.palette.text.primary }}
      >
        Meal Type Distribution
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: theme.palette.text.secondary }}
      >
        Distribution of meal types for the selected date
      </p>
      {chartContent}
      <div className="flex justify-center w-full mt-6">
        <input
          type="date"
          value={selectedDate}
          max={getToday()}
          onChange={e => setSelectedDate(e.target.value)}
          className="px-2 py-1 text-sm border rounded"
          style={{ background: theme.palette.background.paper, color: theme.palette.text.primary }}
        />
      </div>
    </div>
  );
};
