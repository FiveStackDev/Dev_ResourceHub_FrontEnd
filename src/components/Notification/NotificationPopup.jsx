import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { useThemeStyles } from '../../hooks/useThemeStyles';
import './NotificationDialog.css';

// Notification type configurations (same as NotificationCard)
const getTypeConfig = (type) => {
  const configs = {
    maintenance: {
      color: '#1976D2',
      label: 'Maintenance',
    },
    asset_accept: {
      color: '#388E3C',
      label: 'Asset Approved',
    },
    asset_reject: {
      color: '#D32F2F',
      label: 'Asset Rejected',
    },
    default: {
      color: '#FFB300',
      label: 'General',
    },
  };
  return configs[type] || configs.default;
};

const NotificationPopup = ({
  open,
  onClose,
  notification,
  onMarkRead,
  onDelete,
}) => {
  const { updateCSSVariables } = useThemeStyles();
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  if (!notification) return null;

  // Determine notification type
  let type = 'default';
  if (notification.type) {
    if (notification.type.toLowerCase().includes('maintenance'))
      type = 'maintenance';
    else if (notification.type.toLowerCase().includes('accept'))
      type = 'asset_accept';
    else if (notification.type.toLowerCase().includes('reject'))
      type = 'asset_reject';
    else type = 'default';
  }
  const config = getTypeConfig(type);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        className="maintenance-popup-container"
        style={{ background: `${config.color}05` }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar
              src={notification.profile_picture_url}
              sx={{ mr: 2, bgcolor: `${config.color}20`, color: config.color }}
            />
            <Typography variant="h6" fontWeight={600} color={config.color}>
              {notification.title || config.label}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Show type label */}
          <Typography
            variant="caption"
            sx={{ color: config.color, fontWeight: 500, mb: 1 }}
          >
            {config.label}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {notification.message || notification.description}
          </Typography>
          {/* For asset reject, do not show username */}
          {type !== 'asset_reject' && (
            <Typography variant="body2" color="text.secondary">
              Sent by: {notification.username}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Date: {notification.created_at || notification.date}
          </Typography>
        </DialogContent>
        <DialogActions>
          {!notification.is_read && (
            <Button
              onClick={() => onMarkRead(notification.notification_id)}
              color="primary"
            >
              Mark as Read
            </Button>
          )}
          <Button
            onClick={() => onDelete(notification.notification_id)}
            color="error"
          >
            Delete
          </Button>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default NotificationPopup;
