import React from 'react';
import { Grid, Box, Typography, Paper, Button, Alert } from '@mui/material';
import {
  Users,
  Utensils,
  Box as BoxIcon,
  Wrench,
  CalendarDays,
  PackageCheck,
  Refresh,
} from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../layouts/Admin/AdminLayout';
import { StatCard } from '../../components/Dashboard/Admin/StatCard';
import { ResourceCard } from '../../components/Dashboard/Admin/ResourceCard';
import { MealDistributionChart } from '../../components/Dashboard/Admin/MealDistributionChart';
import { ResourceAllocation } from '../../components/Dashboard/Admin/ResourceAllocation';
import ConnectionStatusIndicator from '../../components/Dashboard/Admin/ConnectionStatusIndicator';
import RealtimeNotifications from '../../components/Dashboard/Admin/RealtimeNotifications';
import { getMonthLabels } from '../../utils/dateUtils';
import { useRealtimeAdminDashboard } from '../../query/adminDashboardQueries';
import { QuickActions } from '../../components/Dashboard/User/QuickActions';

const customUserActions = [
  {
    icon: CalendarDays,
    title: 'View Meal Calendar',
    description: 'Check your booked meals',
    iconColor: 'text-blue-500',
    path: '/user-mealcalendar',
  },
  {
    icon: PackageCheck,
    title: 'Check Due Assets',
    description: 'View assets nearing return date',
    iconColor: 'text-purple-500',
    path: '/user-dueassets',
  },
  {
    icon: Wrench,
    title: 'Report Issue',
    description: 'Submit maintenance request',
    iconColor: 'text-red-500',
    path: '/user-maintenance',
  },
];

// Axios instance with JWT token for authenticated endpoints
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Map icon names (strings) to actual icon components
const iconMap = {
  Users: <Users className="text-blue-500" />,
  Utensils: <Utensils className="text-green-500" />,
  Box: <BoxIcon className="text-yellow-500" />,
  Wrench: <Wrench className="text-red-500" />,
};

const AdminDashboard = () => {
  // Use the enhanced hook that combines REST API with real-time WebSocket updates
  const {
    data,
    isLoading,
    isError,
    error,
    isRealtimeConnected,
    realtimeError,
    reconnectAttempts,
    notifications,
    retry,
    refresh,
    connect,
    clearNotifications,
    removeNotification,
  } = useRealtimeAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message ||
              'Failed to load dashboard data. Please try again later.'}
          </Alert>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={retry}
            color="primary"
          >
            Retry
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const { stats, resources, mealData, resourceData } = data || {};

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        {/* Header with Connection Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" fontWeight="600">
            Dashboard
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={refresh}
              size="small"
            >
              Refresh
            </Button>
            
            <ConnectionStatusIndicator
              isConnected={isRealtimeConnected}
              connectionError={realtimeError}
              reconnectAttempts={reconnectAttempts}
              onRetry={connect}
            />
          </Box>
        </Box>

        {/* Real-time Notifications */}
        <RealtimeNotifications
          notifications={notifications}
          onClearAll={clearNotifications}
          onRemoveNotification={removeNotification}
        />

        {/* Connection Status Alert */}
        {!isRealtimeConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Real-time updates are currently unavailable. Data may not be up-to-date.
            {realtimeError && ` Error: ${realtimeError}`}
          </Alert>
        )}

        {isRealtimeConnected && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Real-time updates are active! Dashboard data will update automatically.
          </Alert>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={iconMap[stat.icon] || <BoxIcon />}
            chartData={{
              labels: stat.monthLabels || [],
              data: stat.monthlyData,
            }}
            isRealtime={isRealtimeConnected}
          />
          ))}
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {mealData && <MealDistributionChart data={mealData} />}
          </div>
          <div className="lg:col-span-1">
            {resourceData && <ResourceAllocation data={resourceData} />}
          </div>
        </div>
        
        {/* Quick Actions */}
        <QuickActions actions={customUserActions} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
