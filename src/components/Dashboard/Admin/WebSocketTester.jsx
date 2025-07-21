import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import adminDashboardWebSocket from '../services/websocket/adminDashboardWebSocket';

const WebSocketTester = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const [testMessage, setTestMessage] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev.slice(-19), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    // Connection status handlers
    const handleConnected = () => {
      setConnectionStatus('Connected');
      addLog('WebSocket connected successfully');
    };

    const handleDisconnected = (data) => {
      setConnectionStatus('Disconnected');
      addLog(`WebSocket disconnected: ${data?.reason || 'Unknown reason'}`);
    };

    const handleAuthenticated = () => {
      addLog('WebSocket authenticated successfully');
    };

    const handleError = (error) => {
      addLog(`WebSocket error: ${error.message}`);
    };

    const handleStatsUpdate = (stats) => {
      addLog('Received stats update');
      setMessages(prev => [{
        type: 'stats_update',
        data: stats,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    };

    const handleInitialStats = (stats) => {
      addLog('Received initial stats');
      setMessages(prev => [{
        type: 'initial_stats',
        data: stats,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    };

    const handleNotification = (notification) => {
      addLog('Received notification');
      setMessages(prev => [{
        type: 'notification',
        data: notification,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]);
    };

    // Register event listeners
    adminDashboardWebSocket.on('connected', handleConnected);
    adminDashboardWebSocket.on('disconnected', handleDisconnected);
    adminDashboardWebSocket.on('authenticated', handleAuthenticated);
    adminDashboardWebSocket.on('error', handleError);
    adminDashboardWebSocket.on('stats_update', handleStatsUpdate);
    adminDashboardWebSocket.on('initial_stats', handleInitialStats);
    adminDashboardWebSocket.on('notification', handleNotification);

    return () => {
      // Cleanup event listeners
      adminDashboardWebSocket.off('connected', handleConnected);
      adminDashboardWebSocket.off('disconnected', handleDisconnected);
      adminDashboardWebSocket.off('authenticated', handleAuthenticated);
      adminDashboardWebSocket.off('error', handleError);
      adminDashboardWebSocket.off('stats_update', handleStatsUpdate);
      adminDashboardWebSocket.off('initial_stats', handleInitialStats);
      adminDashboardWebSocket.off('notification', handleNotification);
    };
  }, []);

  const handleConnect = () => {
    addLog('Attempting to connect...');
    adminDashboardWebSocket.connect();
  };

  const handleDisconnect = () => {
    addLog('Disconnecting...');
    adminDashboardWebSocket.disconnect();
    setConnectionStatus('Disconnected');
  };

  const handleSendMessage = () => {
    if (testMessage.trim()) {
      addLog(`Sending message: ${testMessage}`);
      adminDashboardWebSocket.send({
        event: 'test',
        message: testMessage
      });
      setTestMessage('');
    }
  };

  const handleRequestUpdate = () => {
    addLog('Requesting manual update...');
    adminDashboardWebSocket.send({
      event: 'request_update'
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected': return 'success';
      case 'Connecting': return 'warning';
      default: return 'error';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        WebSocket Connection Tester
      </Typography>
      
      <Alert severity={getStatusColor()} sx={{ mb: 2 }}>
        Status: {connectionStatus}
      </Alert>

      <Box display="flex" gap={2} mb={3}>
        <Button 
          variant="contained" 
          onClick={handleConnect}
          disabled={connectionStatus === 'Connected'}
        >
          Connect
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handleDisconnect}
          disabled={connectionStatus === 'Disconnected'}
        >
          Disconnect
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={handleRequestUpdate}
          disabled={connectionStatus !== 'Connected'}
        >
          Request Update
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Test Message"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          fullWidth
          size="small"
        />
        <Button 
          variant="contained" 
          onClick={handleSendMessage}
          disabled={connectionStatus !== 'Connected' || !testMessage.trim()}
        >
          Send
        </Button>
      </Box>

      <Box display="flex" gap={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Messages
            </Typography>
            <List dense>
              {messages.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No messages received yet" />
                </ListItem>
              ) : (
                messages.map((message, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${message.type} (${message.timestamp})`}
                      secondary={JSON.stringify(message.data, null, 2)}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connection Logs
            </Typography>
            <List dense>
              {logs.length === 0 ? (
                <ListItem>
                  <ListItemText primary="No logs yet" />
                </ListItem>
              ) : (
                logs.map((log, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={log}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default WebSocketTester;
