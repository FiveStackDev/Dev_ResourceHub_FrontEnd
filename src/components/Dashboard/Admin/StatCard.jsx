import { useState } from 'react';
import { ChevronDown, Zap } from 'lucide-react';
import { StatCardPopup } from './StatCardPopup';
import { useTheme, Box, Tooltip } from '@mui/material';

export const StatCard = ({ title, value, previousValue, icon, chartData, isRealtime = false }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const theme = useTheme();

  const getCardTextColor = () => {
    if (previousValue !== undefined) {
      if (typeof value === 'number' && typeof previousValue === 'number') {
        if (value > previousValue) return theme.palette.success.main;
        if (value < previousValue) return theme.palette.error.main;
      }
    }
    return theme.palette.text.primary;
  };

  const getSubtitle = () => {
    switch (title) {
      case 'Total Users':
        return 'Active users in the system';
      case 'Meals Served':
        return 'Total meals served';
      case 'Resources':
        return 'Asset requests managed';
      case 'Services':
        return 'Maintenance requests handled';
      case 'Total Employees':
        return 'Active employees in the system';
      case 'Today Total meals':
        return 'Meals served today';
      case 'Due Assets':
        return 'Assets pending return';
      case 'New Maintenance':
        return 'New maintenance requests';
      default:
        return '';
    }
  };

  return (
    <>
      <div
        style={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          border: isRealtime ? `2px solid ${theme.palette.primary.main}20` : 'none',
        }}
        className="rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg"
        onClick={() => setIsPopupOpen(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <h3
            style={{ color: theme.palette.text.secondary }}
            className="text-sm font-medium flex items-center gap-2"
          >
            {title}
            <ChevronDown
              size={16}
              style={{ color: theme.palette.text.disabled }}
            />
          </h3>
          <Box display="flex" alignItems="center" gap={1}>
            {icon}
            {isRealtime && (
              <Tooltip title="Real-time data" arrow>
                <Zap 
                  size={16} 
                  style={{ color: theme.palette.primary.main }}
                  className="animate-pulse"
                />
              </Tooltip>
            )}
          </Box>
        </div>
        <p style={{ color: getCardTextColor() }} className="text-3xl font-bold">
          {value?.toLocaleString() || value}
        </p>
        {isRealtime && (
          <p style={{ color: theme.palette.primary.main }} className="text-xs mt-1">
            Live updates
          </p>
        )}
      </div>

      <StatCardPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={title}
        subtitle={getSubtitle()}
        value={value}
        chartData={chartData}
        isRealtime={isRealtime}
      />
    </>
  );
};
