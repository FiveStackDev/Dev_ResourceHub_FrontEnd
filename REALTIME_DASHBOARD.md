# Real-time Admin Dashboard

This implementation provides real-time updates to the admin dashboard using WebSockets, with automatic fallback to REST API when WebSocket connection is unavailable.

## Features

### Real-time Updates
- ✅ Live statistics updates every 30 seconds
- ✅ Instant notifications for important events
- ✅ Automatic reconnection with exponential backoff
- ✅ Visual indicators for connection status
- ✅ Graceful fallback to REST API

### Connection Management
- **Auto-connect**: Automatically connects to WebSocket on dashboard load
- **Auto-reconnect**: Attempts reconnection up to 5 times with increasing delays
- **Ping/Pong**: Keeps connection alive with periodic heartbeats
- **Token-based Auth**: Uses JWT tokens for secure WebSocket authentication

### Visual Feedback
- **Connection Status Indicator**: Shows real-time connection status
- **Real-time Notifications**: Displays live notifications from the backend
- **Live Data Indicators**: Visual markers on stats cards showing real-time data
- **Error Handling**: Clear error messages and retry options

## Backend Configuration

Your Ballerina backend is already configured with:
- WebSocket service on port 9095 (`/dashboard/admin/ws`)
- Real-time stats updates every 30 seconds
- JWT authentication for WebSocket connections
- Broadcast functionality for organization-specific updates

## Frontend Implementation

### Files Added/Modified:

1. **WebSocket Service** (`src/services/websocket/adminDashboardWebSocket.js`)
   - Singleton WebSocket connection manager
   - Event-driven architecture for handling messages
   - Automatic reconnection with retry logic

2. **React Hook** (`src/hooks/useAdminDashboardWebSocket.js`)
   - React hook for managing WebSocket state
   - Integrates with React lifecycle and cleanup

3. **Enhanced Queries** (`src/query/adminDashboardQueries.js`)
   - `useRealtimeAdminDashboard()` hook combines REST API with WebSocket
   - Automatic fallback when WebSocket is unavailable
   - Query cache updates from real-time data

4. **UI Components**:
   - `ConnectionStatusIndicator.jsx` - Shows connection status
   - `RealtimeNotifications.jsx` - Displays live notifications
   - Enhanced `StatCard.jsx` - Visual indicators for real-time data

5. **Updated Dashboard** (`src/pages/Admin/DashboardAdmin.jsx`)
   - Uses new real-time hook
   - Displays connection status and notifications
   - Manual refresh and retry functionality

## Usage

### Basic Usage
The real-time functionality is automatically enabled when you visit the admin dashboard. No additional configuration is required.

### Manual Actions
- **Refresh**: Click the refresh button to manually request updates
- **Retry Connection**: Click the retry button when disconnected
- **Clear Notifications**: Clear all real-time notifications

### Connection States
- 🟢 **Connected**: Real-time updates active
- 🟡 **Reconnecting**: Attempting to reconnect
- 🔴 **Disconnected**: Using fallback REST API only

## Configuration

### WebSocket URL
Update the WebSocket URL in `adminDashboardWebSocket.js`:
```javascript
this.ws = new WebSocket('ws://localhost:9095/dashboard/admin/ws', ['admin-dashboard']);
```

For production, change to your production WebSocket endpoint.

### Reconnection Settings
Adjust reconnection behavior:
```javascript
this.maxReconnectAttempts = 5;    // Maximum retry attempts
this.reconnectDelay = 3000;       // Initial delay (3 seconds)
```

### Update Frequency
The backend sends updates every 30 seconds by default. Modify in Ballerina:
```ballerina
task:JobId|error jobResult = task:scheduleJobRecurByFrequency(new PeriodicUpdateJob(), 30);
```

## Error Handling

### Connection Errors
- Network issues are handled with automatic reconnection
- Authentication failures close the connection and show error messages
- Invalid messages are logged and ignored

### Data Fallback
- When WebSocket is unavailable, the dashboard uses REST API data
- Users see a warning indicator but functionality remains intact
- Seamless transition between real-time and static data

## Testing

### Test WebSocket Connection
1. Open browser developer tools
2. Navigate to admin dashboard
3. Check console for WebSocket connection messages
4. Verify connection status indicator shows "Connected"

### Test Real-time Updates
1. Make changes in the backend (add users, meals, etc.)
2. Observe dashboard updates within 30 seconds
3. Statistics should update without page refresh

### Test Reconnection
1. Disconnect from network temporarily
2. Observe status change to "Reconnecting"
3. Reconnect to network
4. Status should return to "Connected"

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check if backend WebSocket service is running on port 9095
   - Verify JWT token is valid and present in localStorage
   - Check browser console for detailed error messages

2. **No Real-time Updates**
   - Verify user has Admin or SuperAdmin role
   - Check backend logs for WebSocket message sending
   - Ensure organization ID matches between frontend and backend

3. **Frequent Disconnections**
   - Check network stability
   - Verify WebSocket idle timeout settings
   - Monitor backend logs for connection drops

### Debug Mode
Enable detailed logging by adding to browser console:
```javascript
localStorage.setItem('debug-websocket', 'true');
```

## Security Notes

- WebSocket connections are authenticated using JWT tokens
- Only users with Admin/SuperAdmin roles can connect
- Organization-based data isolation is maintained
- Connection attempts are rate-limited by reconnection logic

## Performance Considerations

- WebSocket connection uses minimal bandwidth
- Real-time updates are throttled to every 30 seconds
- Failed connections don't block the UI
- Query cache prevents unnecessary REST API calls

## Future Enhancements

Potential improvements:
- WebSocket compression for larger payloads
- Selective updates (only changed data)
- User preference for update frequency
- Real-time collaboration features
- Push notifications for critical alerts
