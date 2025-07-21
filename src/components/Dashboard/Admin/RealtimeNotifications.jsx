import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip
} from '@mui/material';
import {
  Notifications,
  ExpandMore,
  ExpandLess,
  Close,
  ClearAll
} from '@mui/icons-material';

const RealtimeNotifications = ({ 
  notifications = [], 
  onClearAll, 
  onRemoveNotification 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Badge badgeContent={notifications.length} color="primary">
              <Notifications />
            </Badge>
            <Typography variant="h6">
              Real-time Notifications
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<ClearAll />}
                onClick={onClearAll}
                color="secondary"
              >
                Clear All
              </Button>
            )}
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
            >
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={isExpanded}>
          <Box mt={2}>
            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                No notifications yet
              </Typography>
            ) : (
              <List dense>
                {notifications.map((notification, index) => (
                  <ListItem
                    key={index}
                    divider={index < notifications.length - 1}
                    sx={{ px: 0 }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="subtitle2">
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={getNotificationColor(notification.type)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          {notification.timestamp && (
                            <Typography variant="caption" color="text.secondary">
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => onRemoveNotification(index)}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default RealtimeNotifications;
