# Real-time Admin Dashboard - Quick Start Guide

## Installation & Setup

### 1. Dependencies Check
Make sure you have the required dependencies installed:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install @tanstack/react-query
```

### 2. Backend Requirements
Ensure your Ballerina backend is running with:
- Main dashboard service on port 9092
- WebSocket service on port 9095
- JWT authentication enabled

### 3. Frontend Configuration
Update the WebSocket URL in `src/services/websocket/adminDashboardWebSocket.js` if needed:
```javascript
// For local development
this.ws = new WebSocket('ws://localhost:9095/dashboard/admin/ws', ['admin-dashboard']);

// For production
this.ws = new WebSocket('wss://your-domain.com/dashboard/admin/ws', ['admin-dashboard']);
```

## Usage Instructions

### 1. Start the Application
```bash
npm run dev
```

### 2. Login as Admin
- Navigate to the login page
- Login with an account that has Admin or SuperAdmin role
- The JWT token will be stored in localStorage automatically

### 3. Access Admin Dashboard
- Navigate to `/admin/dashboard`
- The WebSocket connection will establish automatically
- You should see a green "Connected" indicator in the top-right

### 4. Monitor Real-time Updates
- Stats will update every 30 seconds automatically
- Changes in backend data will reflect immediately
- Notifications will appear in the notifications panel

## Features Overview

### ✅ Real-time Statistics
- User count updates
- Meal events tracking  
- Asset requests monitoring
- Maintenance requests tracking

### ✅ Connection Management
- Automatic connection on page load
- Auto-reconnection with retry logic (5 attempts)
- Visual connection status indicator
- Graceful fallback to REST API

### ✅ Live Notifications
- Real-time notifications from backend
- Expandable notification panel
- Clear all / remove individual notifications
- Timestamp tracking

### ✅ Enhanced UI
- Live data indicators on stat cards
- Connection status in header
- Manual refresh functionality
- Error handling with retry options

## Testing the Integration

### 1. Basic Connection Test
1. Open browser developer tools (F12)
2. Navigate to admin dashboard
3. Check console for these messages:
   ```
   WebSocket connected
   Successfully authenticated with WebSocket
   ```

### 2. Real-time Updates Test
1. Open the admin dashboard
2. In another tab/window, make changes to your system:
   - Add new users
   - Create meal requests
   - Submit asset requests
   - Add maintenance requests
3. Return to dashboard and wait up to 30 seconds
4. Statistics should update automatically

### 3. Reconnection Test
1. Disconnect from internet briefly
2. Status should show "Reconnecting..."
3. Reconnect to internet
4. Status should return to "Connected"

### 4. Using the WebSocket Tester (Optional)
Add this route to test WebSocket functionality:
```jsx
import WebSocketTester from '../components/Dashboard/Admin/WebSocketTester';

// In your router
<Route path="/admin/websocket-test" element={<WebSocketTester />} />
```

## Troubleshooting

### Issue: WebSocket Connection Failed
**Solutions:**
- Check if backend WebSocket service is running on port 9095
- Verify JWT token exists in localStorage
- Check browser console for detailed error messages
- Ensure user has Admin/SuperAdmin role

### Issue: No Real-time Updates
**Solutions:**
- Verify backend periodic task is running (check backend logs)
- Confirm organization ID matches between frontend and backend
- Check if user belongs to the correct organization
- Test manual refresh to ensure REST API works

### Issue: Frequent Disconnections
**Solutions:**
- Check network stability
- Verify WebSocket timeout settings
- Monitor backend logs for connection drops
- Check firewall/proxy settings

### Issue: Authentication Failed
**Solutions:**
- Verify JWT token is valid and not expired
- Check user roles in token payload
- Ensure token includes required claims (userId, orgId, role)
- Try logging out and logging back in

## Performance Notes

- WebSocket connection uses minimal bandwidth
- Updates are throttled to prevent spam
- Query cache prevents unnecessary API calls
- Automatic cleanup on component unmount

## Security

- JWT-based authentication for WebSocket
- Organization-level data isolation
- Role-based access control (Admin/SuperAdmin only)
- Automatic connection cleanup on token expiry

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- IE11: Not supported (WebSocket API required)

## Production Deployment

### 1. Update WebSocket URLs
Change localhost URLs to production endpoints in:
- `src/services/websocket/adminDashboardWebSocket.js`

### 2. Configure Proxy (if needed)
For HTTPS sites, ensure WebSocket uses WSS:
```javascript
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
this.ws = new WebSocket(`${wsProtocol}//your-domain.com/dashboard/admin/ws`);
```

### 3. Environment Variables
Consider using environment variables:
```javascript
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:9095';
```

## Next Steps

### Potential Enhancements
1. **User Preferences**: Allow users to configure update frequency
2. **Push Notifications**: Browser notifications for critical alerts
3. **Data Compression**: Compress WebSocket messages for better performance
4. **Selective Updates**: Only send changed data to reduce bandwidth
5. **Real-time Collaboration**: Show when other admins are online

### Additional Real-time Features
- Real-time user activity monitoring
- Live maintenance request updates  
- Instant asset allocation changes
- Real-time meal booking notifications

## Support

For issues or questions:
1. Check browser console for error messages
2. Review backend logs for WebSocket errors
3. Test with WebSocket tester component
4. Verify authentication and permissions

The real-time dashboard provides a modern, responsive admin experience with live data updates and robust error handling.
