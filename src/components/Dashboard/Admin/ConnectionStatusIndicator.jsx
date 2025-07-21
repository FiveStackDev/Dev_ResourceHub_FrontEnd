import React from 'react';
import { Box, Chip, Tooltip, IconButton } from '@mui/material';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';

const ConnectionStatusIndicator = ({ 
  isConnected, 
  connectionError, 
  reconnectAttempts, 
  onRetry 
}) => {
  const getStatusInfo = () => {
    if (isConnected) {
      return {
        color: 'success',
        icon: <Wifi fontSize="small" />,
        label: 'Connected',
        tooltip: 'Real-time updates active'
      };
    } else if (reconnectAttempts > 0) {
      return {
        color: 'warning',
        icon: <WifiOff fontSize="small" />,
        label: `Reconnecting... (${reconnectAttempts}/5)`,
        tooltip: 'Attempting to reconnect to real-time updates'
      };
    } else {
      return {
        color: 'error',
        icon: <WifiOff fontSize="small" />,
        label: 'Disconnected',
        tooltip: connectionError || 'Real-time updates unavailable'
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Tooltip title={statusInfo.tooltip} arrow>
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          color={statusInfo.color}
          size="small"
          variant="outlined"
        />
      </Tooltip>
      
      {!isConnected && (
        <Tooltip title="Retry connection" arrow>
          <IconButton 
            size="small" 
            onClick={onRetry}
            sx={{ padding: 0.5 }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ConnectionStatusIndicator;
