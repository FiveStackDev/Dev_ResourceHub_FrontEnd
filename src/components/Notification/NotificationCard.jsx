import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Button,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


// Notification type configurations
const getTypeConfig = (type) => {
  const configs = {
    maintenance: {
      color: '#1976D2',
      label: 'Maintenance',
      icon: InfoIcon,
    },
    asset_accept: {
      color: '#388E3C',
      label: 'Asset Approved',
      icon: InfoIcon,
    },
    asset_reject: {
      color: '#D32F2F',
      label: 'Asset Rejected',
      icon: ErrorIcon,
    },
    default: {
      color: '#FFB300',
      label: 'General',
      icon: InfoIcon,
    },
  };
  return configs[type] || configs.default;
};


export const NotificationCard = ({ notification, onMarkRead }) => {
  // Determine notification type
  let type = 'default';
  if (notification.type) {
    if (notification.type.toLowerCase().includes('maintenance')) type = 'maintenance';
    else if (notification.type.toLowerCase().includes('accept')) type = 'asset_accept';
    else if (notification.type.toLowerCase().includes('reject')) type = 'asset_reject';
    else type = 'default';
  }
  const config = getTypeConfig(type);

  // If title is 'Asset Request Accepted', override icon and color
  let showGreenTick = false;
  let IconComponent = config.icon;
  let cardColor = config.color;
  if ((notification.title || '').toLowerCase() === 'asset request accepted') {
    showGreenTick = true;
    IconComponent = CheckCircleIcon;
    cardColor = '#388E3C';
  }
    if ((notification.title || '').toLowerCase() === 'asset request rejected') {
    showGreenTick = true;
    IconComponent = InfoIcon;
    cardColor = '#D32F2F';
  }


  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '90px',
        my: 1,
        borderLeft: `5px solid ${cardColor}`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        background: `${cardColor}05`,
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 16px ${cardColor}30`,
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
            bgcolor: `${cardColor}20`,
            color: cardColor,
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
              color:
                (notification.title || '').toLowerCase() === 'asset request accepted'
                  ? '#388E3C'
                  : (notification.title || '').toLowerCase() === 'asset request rejected'
                  ? '#D32F2F'
                  : config.color,
            }}
          >
            {/* For asset reject, do not show username; for others, show title if available */}
            {type === 'asset_reject' ? config.label : (notification.title || config.label)}
          </Typography>
          <Chip
            label={config.label}
            size="small"
            sx={{
              ml: 1.5,
              bgcolor: `${config.color}10`,
              color: config.color,
              border: `1px solid ${config.color}30`,
              fontWeight: 700,
            }}
          />
        </Box>

        {/* Show type label above description */}
        

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

      {/* Date & Unread Button Section */}
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
        {!notification.is_read && (
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1, bgcolor: '#1976D2', color: '#fff', fontWeight: 600, borderRadius: 2, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#115293' } }}
            onClick={() => onMarkRead && onMarkRead(notification.notification_id)}
          >
            Read
          </Button>
        )}
      </Box>
    </Card>
  );
};
