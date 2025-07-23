import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

// Priority level configurations
const getPriorityConfig = (level) => {
  const configs = {
    High: { color: '#D32F2F', label: 'High', icon: ErrorIcon }, // Red
    Medium: { color: '#F57C00', label: 'Medium', icon: WarningIcon }, // Orange
    Low: { color: '#FFB300', label: 'Low', icon: InfoIcon }, // Light Orange
  };

  return configs[level] || configs.Low; // Default to Low if invalid
};

export const MaintenanceNotificationCard = ({ notification }) => {
  // Use priorityLevel from notification, default to "Low" if not provided
  const priorityLevel = notification.priorityLevel || 'Low';
  const config = getPriorityConfig(priorityLevel);
  const IconComponent = config.icon;

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '80px',
        my: 1,
        borderLeft: `4px solid ${config.color}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Icon Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
          width: '60px',
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${config.color}10`,
            color: config.color,
            width: 40,
            height: 40,
          }}
        >
          <IconComponent fontSize="small" />
        </Avatar>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 1.5,
          flexGrow: 1,
        }}
      >
        <Box display="flex" alignItems="center" mb={0.5}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {notification.name || notification.username}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: `${config.color}10`,
              color: config.color,
              border: `1px solid ${config.color}30`,
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {notification.description}
        </Typography>
      </Box>

      {/* Date Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          p: 1.5,
          width: '160px',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {notification.date || notification.request_date}
        </Typography>
      </Box>
    </Card>
  );
};
