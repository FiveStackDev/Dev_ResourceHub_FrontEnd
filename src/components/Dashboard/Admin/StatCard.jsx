import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { StatCardPopup } from './StatCardPopup';
import { useTheme } from '@mui/material';

export const StatCard = ({ title, value, previousValue, icon, chartData }) => {
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
        }}
        className="rounded-lg p-4 cursor-pointer transition-all"
        onClick={() => setIsPopupOpen(true)}
      >
        <div className="flex items-center justify-between mb-1">
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
          {icon}
        </div>
        <p style={{ color: getCardTextColor() }} className="text-2xl font-bold">
          {value}
        </p>
      </div>

      <StatCardPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={title}
        subtitle={getSubtitle()}
        value={value}
        chartData={chartData}
      />
    </>
  );
};
