import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';
import { BASE_URLS } from '../services/api/config';
import { decodeToken } from '../contexts/UserContext';

export function useUserDashboardData() {
  return useQuery({
    queryKey: ['userDashboardData'],
    queryFn: async () => {
      // Use decoded token for userId instead of localStorage
      const decoded = decodeToken();
      const userId = decoded?.id;
      if (!userId) throw new Error('User ID not found in token');
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get(`${BASE_URLS.dashboardUser}/stats/${userId}`, {
          headers: { ...getAuthHeader() },
        }),
        axios.get(`${BASE_URLS.dashboardUser}/activities/${userId}`, {
          headers: { ...getAuthHeader() },
        }),
      ]);
      // If backend sends monthLabels, map it to each stat
      if (Array.isArray(statsResponse.data)) {
        return {
          stats: statsResponse.data,
          recentActivities: activitiesResponse.data,
        };
      } else {
        const monthLabels = statsResponse.data.monthLabels || [];
        return {
          stats: [
            {
              title: 'My Meals Today',
              value: statsResponse.data.mealsToday,
              icon: 'Utensils',
              monthlyData: statsResponse.data.mealsMonthlyData || [],
              monthLabels,
            },
            {
              title: 'My Assets',
              value: statsResponse.data.assets,
              icon: 'Box',
              monthlyData: statsResponse.data.assetsMonthlyData || [],
              monthLabels,
            },
            {
              title: 'My Maintenance Requests',
              value: statsResponse.data.maintenanceRequests,
              icon: 'Wrench',
              monthlyData: statsResponse.data.maintenanceMonthlyData || [],
              monthLabels,
            },
          ],
          recentActivities: activitiesResponse.data,
        };
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
