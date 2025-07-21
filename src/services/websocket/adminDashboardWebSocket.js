class AdminDashboardWebSocket {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
    this.listeners = {
      stats_update: [],
      notification: [],
      authenticated: [],
      error: [],
      connected: [],
      disconnected: [],
      initial_stats: []
    };
    this.pingInterval = null;
    this.token = null;
  }

  // Add event listener
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit event to all listeners
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Connect to WebSocket
  connect() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      this.emit('error', { message: 'No authentication token found' });
      return;
    }

    this.token = token;
    
    try {
      // Connect to WebSocket endpoint
      this.ws = new WebSocket('ws://localhost:9095/dashboard/admin/ws', ['admin-dashboard']);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send authentication message
        this.send({
          event: 'authenticate',
          token: this.token
        });

        // Start ping interval to keep connection alive
        this.startPing();
        
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          switch (message.event) {
            case 'authenticated':
              console.log('Successfully authenticated with WebSocket');
              this.emit('authenticated', message);
              break;
            
            case 'initial_stats':
              console.log('Received initial stats:', message.data);
              this.emit('initial_stats', message.data);
              break;
            
            case 'stats_update':
              console.log('Received stats update:', message.data);
              this.emit('stats_update', message.data);
              break;
            
            case 'notification':
              console.log('Received notification:', message.data);
              this.emit('notification', message.data);
              break;
            
            case 'error':
              console.error('WebSocket error:', message.message);
              this.emit('error', { message: message.message });
              break;
            
            case 'pong':
              // Ping response received
              break;
            
            default:
              console.log('Unknown WebSocket event:', message.event);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        this.isConnected = false;
        this.stopPing();
        this.emit('disconnected', { code: event.code, reason: event.reason });
        
        // Attempt to reconnect if not intentionally closed
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', { message: 'WebSocket connection error' });
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.emit('error', { message: 'Failed to connect to WebSocket' });
    }
  }

  // Send message to WebSocket
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Start ping to keep connection alive
  startPing() {
    this.pingInterval = setInterval(() => {
      this.send({ event: 'ping' });
    }, 30000); // Ping every 30 seconds
  }

  // Stop ping interval
  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // Schedule reconnection
  scheduleReconnect() {
    this.reconnectAttempts++;
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      if (!this.isConnected && this.reconnectAttempts <= this.maxReconnectAttempts) {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect();
      }
    }, this.reconnectDelay);
  }

  // Disconnect from WebSocket
  disconnect() {
    this.stopPing();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.ws ? this.ws.readyState : WebSocket.CLOSED,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const adminDashboardWebSocket = new AdminDashboardWebSocket();

export default adminDashboardWebSocket;
