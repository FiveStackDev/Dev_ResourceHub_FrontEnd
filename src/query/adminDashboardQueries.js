import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';
import { BASE_URLS } from '../services/api/config';
import { useAdminDashboardWebSocket } from '../hooks/useAdminDashboardWebSocket';

// Hook for traditional REST API data (fallback)
export function useAdminDashboardData() {
  return useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: async () => {
      const [statsRes, resourcesRes, mealRes, resourceAllocRes] =
        await Promise.all([
          axios.get(`${BASE_URLS.dashboardAdmin}/stats`, { headers: { ...getAuthHeader() } }),
          axios.get(`${BASE_URLS.dashboardAdmin}/resources`, { headers: { ...getAuthHeader() } }),
          axios.get(`${BASE_URLS.dashboardAdmin}/mealdistribution`, { headers: { ...getAuthHeader() } }),
          axios.get(`${BASE_URLS.dashboardAdmin}/resourceallocation`, { headers: { ...getAuthHeader() } }),
        ]);
      return {
        stats: statsRes.data,
        resources: resourcesRes.data,
        mealData: mealRes.data,
        resourceData: resourceAllocRes.data,
      };
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
  });
}

// Enhanced hook that combines REST API with real-time WebSocket updates
export function useRealtimeAdminDashboard() {
  const queryClient = useQueryClient();
  
  // Get WebSocket connection and real-time data
  const {
    isConnected,
    connectionError,
    reconnectAttempts,
    realtimeStats,
    notifications,
    connect,
    disconnect,
    requestUpdate,
    clearNotifications,
    removeNotification,
  } = useAdminDashboardWebSocket();

  // Get initial data via REST API
  const {
    data: restData,
    isLoading: restLoading,
    isError: restError,
    error: restErrorDetails,
    refetch: refetchRest
  } = useAdminDashboardData();

  // Convert real-time stats to the format expected by components
  const realtimeStatsFormatted = useMemo(() => {
    if (!realtimeStats) return null;

    return [
      {
        title: "Total Users",
        value: realtimeStats.userCount,
        icon: "Users",
        monthlyData: realtimeStats.monthlyUserCounts,
        monthLabels: realtimeStats.monthLabels
      },
      {
        title: "Meals Served",
        value: realtimeStats.mealEventsCount,
        icon: "Utensils",
        monthlyData: realtimeStats.monthlyMealCounts,
        monthLabels: realtimeStats.monthLabels
      },
      {
        title: "Resources",
        value: realtimeStats.assetRequestsCount,
        icon: "Box",
        monthlyData: realtimeStats.monthlyAssetRequestCounts,
        monthLabels: realtimeStats.monthLabels
      },
      {
        title: "Services",
        value: realtimeStats.maintenanceCount,
        icon: "Wrench",
        monthlyData: realtimeStats.monthlyMaintenanceCounts,
        monthLabels: realtimeStats.monthLabels
      }
    ];
  }, [realtimeStats]);

  // Update query cache when real-time data arrives
  useEffect(() => {
    if (realtimeStatsFormatted && restData) {
      const updatedData = {
        ...restData,
        stats: realtimeStatsFormatted
      };
      
      queryClient.setQueryData(['adminDashboardData'], updatedData);
    }
  }, [realtimeStatsFormatted, restData, queryClient]);

  // Retry function that tries both REST and WebSocket
  const retry = () => {
    refetchRest();
    if (!isConnected) {
      connect();
    } else {
      requestUpdate();
    }
  };

  // Manual refresh function
  const refresh = () => {
    if (isConnected) {
      requestUpdate();
    }
    refetchRest();
  };

  // Determine loading state
  const isLoading = restLoading && !realtimeStats;

  // Determine error state (show error only if both REST and WebSocket fail)
  const isError = restError && !isConnected && !realtimeStats;

  // Use real-time data if available, otherwise fall back to REST data
  const data = useMemo(() => {
    if (realtimeStatsFormatted && restData) {
      return {
        ...restData,
        stats: realtimeStatsFormatted
      };
    }
    return restData;
  }, [realtimeStatsFormatted, restData]);

  return {
    // Data
    data,
    isLoading,
    isError,
    error: restErrorDetails,
    
    // Real-time specific
    isRealtimeConnected: isConnected,
    realtimeError: connectionError,
    reconnectAttempts,
    notifications,
    
    // Actions
    retry,
    refresh,
    refetch: refetchRest,
    connect,
    disconnect,
    requestUpdate,
    clearNotifications,
    removeNotification,
  };
}
