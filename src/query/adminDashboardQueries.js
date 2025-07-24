import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';
import { BASE_URLS } from '../services/api/config';

export function useAdminDashboardData() {
  return useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: async () => {
      const [statsRes, resourceAllocRes, mostRequestedAssetRes] =
        await Promise.all([
          axios.get(`${BASE_URLS.dashboardAdmin}/stats`, {
            headers: { ...getAuthHeader() },
          }),
          axios.get(`${BASE_URLS.dashboardAdmin}/resourceallocation`, {
            headers: { ...getAuthHeader() },
          }),
          axios.get(`${BASE_URLS.dashboardAdmin}/mostrequestedasset`, {
            headers: { ...getAuthHeader() },
          }),
        ]);
      return {
        stats: statsRes.data,
        resourceData: resourceAllocRes.data,
        mostRequestedAsset: mostRequestedAssetRes.data,
      };
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}
