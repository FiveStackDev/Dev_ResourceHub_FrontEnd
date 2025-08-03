import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { StatCardPopup } from './StatCardPopup';
import { useTheme, Box, Typography } from '@mui/material';

export const StatCard = ({ title, value, previousValue, icon, chartData }) => {
  const theme = useTheme();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getCardTextColor = () => {
    if (previousValue !== undefined) {
      if (typeof value === 'number' && typeof previousValue === 'number') {
        if (value > previousValue) return 'text-green-500';
        if (value < previousValue) return 'text-red-500';
      }
    }
    return 'text-black';
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
          p: { xs:2, sm: 2, md:2 },
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          }
        }}
        onClick={() => setIsPopupOpen(true)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
            <ChevronDown size={16} style={{ color: theme.palette.text.disabled }} />
          </Typography>
          <Box sx={{ flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: { xs: '1.5rem', sm: '1rem', md: '2rem' }
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
