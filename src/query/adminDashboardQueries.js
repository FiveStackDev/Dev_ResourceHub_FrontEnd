import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';
import { BASE_URLS } from '../services/api/config';

export function useAdminDashboardData() {
  return useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: async () => {
      const [statsRes, mealRes, resourceAllocRes] =
        await Promise.all([
          axios.get(`${BASE_URLS.dashboardAdmin}/stats`, {
            headers: { ...getAuthHeader() },
          }),
          axios.get(`${BASE_URLS.dashboardAdmin}/mealdistribution`, {
            headers: { ...getAuthHeader() },
          }),
          axios.get(`${BASE_URLS.dashboardAdmin}/resourceallocation`, {
            headers: { ...getAuthHeader() },
          }),
        ]);
      return {
        stats: statsRes.data,
        mealData: mealRes.data,
        resourceData: resourceAllocRes.data,
      };
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    refetchInterval: 2500, // Refetch every 5 seconds
  });
}
