import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { StatCardPopup } from './StatCardPopup';
import { useTheme, Box, Typography } from '@mui/material';

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
      <Box
        sx={{
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[1],
          borderRadius: 2,
          p: { xs: 2, sm: 3, md: 4 },
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          }
        }}
        onClick={() => setIsPopupOpen(true)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {title}
            <ChevronDown
              size={16}
              style={{ color: theme.palette.text.disabled }}
            />
          </Typography>
          <Box sx={{ flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
        <Typography 
          variant="h4"
          sx={{ 
            color: getCardTextColor(),
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
          }}
        >
          {value}
        </Typography>
      </Box>

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
