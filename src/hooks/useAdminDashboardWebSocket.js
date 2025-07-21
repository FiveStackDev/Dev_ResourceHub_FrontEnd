import { useEffect, useRef, useState, useCallback } from 'react';
import adminDashboardWebSocket from '../services/websocket/adminDashboardWebSocket';

export const useAdminDashboardWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeStats, setRealtimeStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const mountedRef = useRef(true);

  // Handle stats updates
  const handleStatsUpdate = useCallback((stats) => {
    if (mountedRef.current) {
      setRealtimeStats(stats);
    }
  }, []);

  // Handle initial stats
  const handleInitialStats = useCallback((stats) => {
    if (mountedRef.current) {
      setRealtimeStats(stats);
    }
  }, []);

  // Handle notifications
  const handleNotification = useCallback((notification) => {
    if (mountedRef.current) {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
    }
  }, []);

  // Handle connection events
  const handleConnected = useCallback(() => {
    if (mountedRef.current) {
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
    }
  }, []);

  const handleDisconnected = useCallback(() => {
    if (mountedRef.current) {
      setIsConnected(false);
    }
  }, []);

  const handleAuthenticated = useCallback(() => {
    if (mountedRef.current) {
      console.log('WebSocket authenticated successfully');
    }
  }, []);

  const handleError = useCallback((error) => {
    if (mountedRef.current) {
      setConnectionError(error.message);
      console.error('WebSocket error:', error.message);
    }
  }, []);

  // Connect to WebSocket
  const connect = useCallback(() => {
    adminDashboardWebSocket.connect();
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    adminDashboardWebSocket.disconnect();
  }, []);

  // Send manual refresh request
  const requestUpdate = useCallback(() => {
    adminDashboardWebSocket.send({
      event: 'request_update'
    });
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove specific notification
  const removeNotification = useCallback((index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Register event listeners
    adminDashboardWebSocket.on('stats_update', handleStatsUpdate);
    adminDashboardWebSocket.on('initial_stats', handleInitialStats);
    adminDashboardWebSocket.on('notification', handleNotification);
    adminDashboardWebSocket.on('connected', handleConnected);
    adminDashboardWebSocket.on('disconnected', handleDisconnected);
    adminDashboardWebSocket.on('authenticated', handleAuthenticated);
    adminDashboardWebSocket.on('error', handleError);

    // Connect on mount
    connect();

    // Update reconnect attempts periodically
    const intervalId = setInterval(() => {
      if (mountedRef.current) {
        const status = adminDashboardWebSocket.getConnectionStatus();
        setReconnectAttempts(status.reconnectAttempts);
      }
    }, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
      
      // Remove event listeners
      adminDashboardWebSocket.off('stats_update', handleStatsUpdate);
      adminDashboardWebSocket.off('initial_stats', handleInitialStats);
      adminDashboardWebSocket.off('notification', handleNotification);
      adminDashboardWebSocket.off('connected', handleConnected);
      adminDashboardWebSocket.off('disconnected', handleDisconnected);
      adminDashboardWebSocket.off('authenticated', handleAuthenticated);
      adminDashboardWebSocket.off('error', handleError);
      
      // Disconnect
      disconnect();
    };
  }, [
    handleStatsUpdate,
    handleInitialStats,
    handleNotification,
    handleConnected,
    handleDisconnected,
    handleAuthenticated,
    handleError,
    connect,
    disconnect
  ]);

  return {
    // Connection state
    isConnected,
    connectionError,
    reconnectAttempts,
    
    // Data
    realtimeStats,
    notifications,
    
    // Actions
    connect,
    disconnect,
    requestUpdate,
    clearNotifications,
    removeNotification,
    
    // Helper to get connection status
    getConnectionStatus: () => adminDashboardWebSocket.getConnectionStatus()
  };
};
