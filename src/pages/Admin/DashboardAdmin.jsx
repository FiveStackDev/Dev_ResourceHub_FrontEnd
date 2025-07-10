import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import {
  Users,
  Utensils,
  Box as BoxIcon,
  Wrench,
  CalendarDays,
  PackageCheck,
} from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../../layouts/Admin/AdminLayout';
import { StatCard } from '../../components/Dashboard/Admin/StatCard';
import { ResourceCard } from '../../components/Dashboard/Admin/ResourceCard';
import { MealDistributionChart } from '../../components/Dashboard/Admin/MealDistributionChart';
import { ResourceAllocation } from '../../components/Dashboard/Admin/ResourceAllocation';
import { getMonthLabels } from '../../utils/dateUtils';
import { useAdminDashboardData } from '../../query/adminDashboardQueries';
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
  const monthLabels = getMonthLabels();
  // If you use axios directly for authenticated endpoints, use getAuthConfig()
  // Example:
  // const response = await axios.get(`${BASE_URL}/some-protected-endpoint`, getAuthConfig());
  const { data, isLoading, isError, error, refetch } = useAdminDashboardData();

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
        <div className="p-6 text-red-500">
          {error?.message ||
            'Failed to load dashboard data. Please try again later.'}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { stats, resources, mealData, resourceData } = data;

  return (
    <AdminLayout>
      <div className="min-h-screen space-y-6 p-6">
        {/* Heading */}
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={iconMap[stat.icon] || <BoxIcon />}
              chartData={{
                labels: monthLabels,
                data: stat.monthlyData,
              }}
            />
          ))}
        </div>
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MealDistributionChart data={mealData} />
          </div>
          <div className="lg:col-span-1">
            <ResourceAllocation data={resourceData} />
          </div>
        </div>
        {/* Resource Cards
        <h2 className="text-xl font-semibold pt-4">Resource Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              total={resource.total}
              highPriority={resource.highPriority}
              progress={resource.progress}
            />
          ))}
        </div> */}
        <QuickActions actions={customUserActions} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
