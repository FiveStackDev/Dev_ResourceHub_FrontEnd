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

// Updated to be self-contained with date functionality
export const ChartResources = ({ date }) => {
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
  const [assetDetails, setAssetDetails] = useState(null); // Store detailed asset info
  const [mostRequestedAssets, setMostRequestedAssets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Fetch both resource allocation and most requested assets, plus asset details
    Promise.all([
      axios.get(
        `${BASE_URLS.dashboardAdmin}/resourceallocation?date=${selectedDate}`,
        {
          headers: { ...getAuthHeader() },
        },
      ),
      axios.get(
        `${BASE_URLS.dashboardAdmin}/mostrequestedasset?date=${selectedDate}`,
        {
          headers: { ...getAuthHeader() },
        },
      ),
      // Fetch all assets to get names by category
      axios.get(`${BASE_URLS.asset}/details`, {
        headers: { ...getAuthHeader() },
      }),
    ])
      .then(([resourceRes, topAssetsRes, allAssetsRes]) => {
        setData(resourceRes.data);
        setMostRequestedAssets(topAssetsRes.data);
        setAssetDetails(allAssetsRes.data);
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
          height: '100%',
        }}
        className="p-6 rounded-lg"
      >
        <h2
          className="mb-2 text-xl font-semibold"
          style={{ color: theme.palette.text.primary }}
        >
          Available Resources
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
        <div>Loading available resources and asset request data...</div>
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
          height: '100%',
        }}
        className="p-6 rounded-lg"
      >
        <h2
          className="mb-2 text-xl font-semibold"
          style={{ color: theme.palette.text.primary }}
        >
          Available Resources
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
  if (!data || data.length === 0) {
    chartContent = (
      <div
        className="flex flex-col items-center justify-center flex-1 p-6 text-center"
        style={{ minHeight: 180 }}
      >
        <div className="mb-4 text-4xl">📦</div>
        <div
          className="mb-2 text-sm font-medium"
          style={{ color: theme.palette.text.primary }}
        >
          No resource data available
        </div>
        <div
          className="mb-4 text-xs"
          style={{ color: theme.palette.text.secondary }}
        >
          No available resources for the selected date. Try selecting a
          different date or check if assets have been configured for your
          organization.
        </div>
        <div
          className="space-y-1 text-xs"
          style={{ color: theme.palette.text.secondary }}
        >
          <div>
            💡 <strong>Tips:</strong>
          </div>
          <div>• Check if assets are configured</div>
          <div>• Verify resource categories are set up</div>
          <div>• Try selecting a different date</div>
        </div>
      </div>
    );
  } else {
    // Group asset names by category
    const assetNamesByCategory = {};

    if (assetDetails && assetDetails.length > 0) {
      assetDetails.forEach((asset) => {
        const category = asset.category;
        if (!assetNamesByCategory[category]) {
          assetNamesByCategory[category] = [];
        }
        if (
          asset.asset_name &&
          !assetNamesByCategory[category].includes(asset.asset_name)
        ) {
          assetNamesByCategory[category].push(asset.asset_name);
        }
      });
    }

    // Create options with access to asset names
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          display: false, // We'll create a custom legend
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const categoryName = tooltipItem.label;
              const count = tooltipItem.raw;
              return `${categoryName}: ${count} available assets`;
            },
            title: function (tooltipItems) {
              const selectedDateFormatted = new Date(
                selectedDate,
              ).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              return `Available Resources - ${selectedDateFormatted}`;
            },
            afterLabel: function (tooltipItem) {
              const total = tooltipItem.dataset.data.reduce(
                (sum, value) => sum + value,
                0,
              );
              const percentage = ((tooltipItem.raw / total) * 100).toFixed(1);

              // Get asset names for this category from the data
              const categoryName = tooltipItem.label;
              const assetNames = assetNamesByCategory[categoryName];

              const lines = [`${percentage}% of total available resources`];

              if (assetNames && assetNames.length > 0) {
                lines.push(''); // Empty line for spacing
                lines.push('Available Assets:');
                assetNames.forEach((assetName) => {
                  lines.push(`• ${assetName}`);
                });
              }

              return lines;
            },
            footer: function (tooltipItems) {
              const total = tooltipItems[0].dataset.data.reduce(
                (sum, value) => sum + value,
                0,
              );
              return `Total Resources: ${total}`;
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

    const chartData = {
      labels: data.map((item) => item.category),
      datasets: [
        {
          data: data.map((item) => item.allocated),
          backgroundColor: COLORS,
          borderWidth: 2,
          borderColor: '#fff',
          hoverBackgroundColor: COLORS.map((color) =>
            color.replace('rgb', 'rgba').replace(')', ', 0.8)'),
          ),
          hoverBorderWidth: 3,
          hoverBorderColor: '#fff',
          hoverOffset: 10,
        },
      ],
    };

    chartContent = (
      <div style={{ width: '100%', maxWidth: '220px', height: 'auto' }}>
        <div style={{ width: '100%', height: '180px', position: 'relative' }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        {/* Custom Legend */}
        <div className="flex flex-col items-start mt-3 space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span
                className="text-xs"
                style={{ color: theme.palette.text.primary }}
              >
                {item.category} ({item.allocated})
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
        Resource Distribution
      </h2>
      <p
        className="mb-6 text-sm"
        style={{ color: theme.palette.text.secondary }}
      >
        Available Assets for the selected date
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

      {/* Most Requested Assets Section */}
      {mostRequestedAssets && (
        <div
          className="w-full pt-4 mt-4 border-t"
          style={{ borderColor: theme.palette.divider }}
        >
          <h3
            className="mb-3 text-sm font-medium text-center"
            style={{ color: theme.palette.text.primary }}
          >
            Most Requested Resource
          </h3>
          {mostRequestedAssets.length > 0 ? (
            <>
              <div className="flex justify-center gap-4 mb-3">
                {mostRequestedAssets.slice(0, 3).map((asset, index) => (
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
                      {asset.asset_name}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      {asset.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: theme.palette.text.secondary }}
                    >
                      {asset.request_count}{' '}
                      {asset.request_count === 1 ? 'request' : 'requests'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary for top assets */}
              <div
                className="p-2 text-xs text-center rounded"
                style={{
                  background: theme.palette.background.default,
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                💡 Top {Math.min(mostRequestedAssets.length, 3)} resource types
                represent{' '}
                {(
                  (mostRequestedAssets
                    .slice(0, 3)
                    .reduce((sum, asset) => sum + asset.request_count, 0) /
                    (mostRequestedAssets.reduce(
                      (sum, asset) => sum + asset.request_count,
                      0,
                    ) || 1)) *
                  100
                ).toFixed(1)}
                % of today's requests
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
              No asset requests found for this date
            </div>
          )}
        </div>
      )}
    </div>
  );
};
