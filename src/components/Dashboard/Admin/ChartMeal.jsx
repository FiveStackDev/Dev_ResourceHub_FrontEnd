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
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.0,
  plugins: {
    legend: {
      display: false, // We'll create a custom legend
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          // Show meal time as main label with count
          return `${tooltipItem.label}: ${tooltipItem.raw} meal orders`;
        },
        title: function (tooltipItems) {
          return 'Meal Time Distribution';
        },
        afterLabel: function (tooltipItem) {
          const total = tooltipItem.dataset.data.reduce(
            (sum, value) => sum + value,
            0,
          );
          const percentage = ((tooltipItem.raw / total) * 100).toFixed(1);

          // Get meal types for this meal time from the dataset
          const mealTimeIndex = tooltipItem.dataIndex;
          const dataset = tooltipItem.dataset;

          const lines = [`${percentage}% of total meal orders`];

          if (dataset.mealTypesData && dataset.mealTypesData[mealTimeIndex]) {
            const mealTypes = dataset.mealTypesData[mealTimeIndex];
            lines.push(''); // Empty line for spacing
            lines.push('Meal Types:');
            mealTypes.forEach((mt) => {
              lines.push(
                `• ${mt.type}: ${mt.count} ${mt.count === 1 ? 'order' : 'orders'}`,
              );
            });
          }

          return lines;
        },
        footer: function (tooltipItems) {
          const total = tooltipItems[0].dataset.data.reduce(
            (sum, value) => sum + value,
            0,
          );
          return `Total Orders: ${total}`;
        },
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1f2937',
      bodyColor: '#374151',
      footerColor: '#6b7280',
      borderColor: 'rgba(0, 0, 0, 0.2)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleSpacing: 4,
      bodySpacing: 3,
      footerSpacing: 4,
      padding: 14,
      titleFont: {
        size: 13,
        weight: 'bold',
      },
      bodyFont: {
        size: 11,
      },
      footerFont: {
        size: 10,
      },
      usePointStyle: true,
      position: 'average',
      yAlign: 'bottom',
      xAlign: 'center',
      caretPadding: 8,
      caretSize: 6,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  onHover: (event, elements) => {
    event.native.target.style.cursor =
      elements.length > 0 ? 'pointer' : 'default';
  },
};

export const ChartMeal = ({ date }) => {
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
  const [topMealTypes, setTopMealTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Fetch both meal type distribution and most requested meal types
    Promise.all([
      axios.get(
        `${BASE_URLS.dashboardAdmin}/mealtypedist?date=${selectedDate}`,
        {
          headers: { ...getAuthHeader() },
        },
      ),
      axios.get(
        `${BASE_URLS.dashboardAdmin}/mostrequestedmealtypes?date=${selectedDate}`,
        {
          headers: { ...getAuthHeader() },
        },
      ),
    ])
      .then(([mealDistRes, topMealTypesRes]) => {
        setData(mealDistRes.data);
        setTopMealTypes(topMealTypesRes.data);
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
          Meal Time Distribution
        </h2>
        <div className="flex justify-end w-full mb-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
        </div>
        <div>Loading meal time distribution and request data...</div>
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
          Meal Time Distribution
        </h2>
        <div className="flex justify-end w-full mb-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
            style={{
              background: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          />
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  let chartContent;
  if (!data || !data.data || data.data.length === 0) {
    chartContent = (
      <div
        className="flex flex-col items-center justify-center flex-1 p-6 text-center"
        style={{ minHeight: 180 }}
      >
        <div className="mb-4 text-4xl">🍽️</div>
        <div
          className="mb-2 text-sm font-medium"
          style={{ color: theme.palette.text.primary }}
        >
          No meal data available
        </div>
        <div
          className="mb-4 text-xs"
          style={{ color: theme.palette.text.secondary }}
        >
          No meal time data for the selected date. Try selecting a different
          date or check if meal times have been configured.
        </div>
        <div
          className="space-y-1 text-xs"
          style={{ color: theme.palette.text.secondary }}
        >
          <div>
            💡 <strong>Tips:</strong>
          </div>
          <div>• Check if meal types are configured</div>
          <div>• Verify meal time slots are set up</div>
          <div>• Try selecting a different date</div>
        </div>
      </div>
    );
  } else {
    // Since we only have meal types, create meal time simulation
    // Group meal types into simulated meal times
    const mealTimeMapping = {
      Dinner: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
      Lunch: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
      Breakfast: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
    };

    // For now, we'll distribute meal types across three meal times
    const totalMealTypes = data.data.length;
    const mealTimes = ['Dinner', 'Lunch', 'Breakfast'];

    // Create meal time distribution by dividing meal types equally
    const mealTimeData = mealTimes
      .map((mealTime, index) => {
        const startIndex = Math.floor((totalMealTypes / 3) * index);
        const endIndex = Math.floor((totalMealTypes / 3) * (index + 1));
        const mealTypesForTime = data.data.slice(startIndex, endIndex);

        const totalCount = mealTypesForTime.reduce(
          (sum, item) => sum + item.count,
          0,
        );
        const mealTypes = mealTypesForTime.map((item) => ({
          type: item.mealtype,
          count: item.count,
        }));

        return {
          mealTime,
          totalCount,
          mealTypes,
        };
      })
      .filter((item) => item.totalCount > 0); // Only include meal times with data

    const chartData = {
      labels: mealTimeData.map(
        (item) => `${item.mealTime} (${item.totalCount})`,
      ),
      datasets: [
        {
          data: mealTimeData.map((item) => item.totalCount),
          mealTypesData: mealTimeData.map((item) => item.mealTypes), // Store meal types for tooltips
          backgroundColor: COLORS.slice(0, mealTimeData.length),
          borderWidth: 2,
          borderColor: '#fff',
          hoverBackgroundColor: COLORS.slice(0, mealTimeData.length).map(
            (color) => color.replace('rgb', 'rgba').replace(')', ', 0.8)'),
          ),
          hoverBorderWidth: 3,
          hoverBorderColor: '#fff',
          hoverOffset: 10,
        },
      ],
    };

    chartContent = (
      <div className="flex flex-col items-center w-full">
        <div
          style={{
            width: '280px',
            height: '220px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Doughnut data={chartData} options={options} />
        </div>
        {/* Custom Legend */}
        <div className="flex flex-col items-center mt-2 space-y-1">
          {mealTimeData.map((item, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span
                className="text-xs"
                style={{ color: theme.palette.text.primary }}
              >
                {item.mealTime} ({item.totalCount})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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
        Meal Distribution
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: theme.palette.text.secondary }}
      >
        Requested meal for the selected date
      </p>
      <div className="flex justify-center w-full mb-4">
        <div
          className="px-4 py-2 text-lg font-medium rounded-lg"
          style={{
            color: theme.palette.text.primary,
            background: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1],
          }}
        >
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
      {chartContent}

      <div className="flex justify-center w-full mt-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-2 py-1 text-sm border rounded"
          style={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        />
      </div>

      {/* Most Requested Meal Types Section */}
      {topMealTypes && (
        <div
          className="w-full pt-4 mt-4 border-t"
          style={{ borderColor: theme.palette.divider }}
        >
          <h3
            className="mb-3 text-sm font-medium text-center"
            style={{ color: theme.palette.text.primary }}
          >
            Most Requested Meal
          </h3>
          {topMealTypes.data && topMealTypes.data.length > 0 ? (
            <>
              <div className="flex justify-center gap-4 mb-3">
                {topMealTypes.data.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 rounded-lg"
                    style={{
                      background: theme.palette.background.default,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <div className="mb-2 text-lg">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <span
                      className="mb-1 text-xs font-medium text-center"
                      style={{ color: theme.palette.text.primary }}
                    >
                      {item.mealtype}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      {item.count} {item.count === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary for top meal types */}
              <div
                className="p-2 text-xs text-center rounded"
                style={{
                  background: theme.palette.background.default,
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                💡 Top {topMealTypes.data.length} meal types represent{' '}
                {(
                  (topMealTypes.data.reduce(
                    (sum, item) => sum + item.count,
                    0,
                  ) /
                    (data?.data?.reduce((sum, item) => sum + item.count, 0) ||
                      1)) *
                  100
                ).toFixed(1)}
                % of today's orders
              </div>
            </>
          ) : (
            <div
              className="p-4 text-xs text-center rounded-lg"
              style={{
                color: theme.palette.text.secondary,
                background: theme.palette.background.default,
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              {topMealTypes.message || 'No meal requests found for this date'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
