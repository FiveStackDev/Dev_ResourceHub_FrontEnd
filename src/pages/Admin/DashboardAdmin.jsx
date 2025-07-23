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
import AdminLayout from '../../layouts/Admin/AdminLayout';
import { StatCard } from '../../components/Dashboard/Admin/StatCard';
import { MealDistributionChart } from '../../components/Dashboard/Admin/MealDistributionChart';
import { MealTypeDistribution } from '../../components/Dashboard/Admin/MealTypeDistribution';
import { ResourceAllocation } from '../../components/Dashboard/Admin/ResourceAllocation';
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

// Map icon names (strings) to actual icon components
const iconMap = {
  Users: <Users className="text-blue-500" />,
  Utensils: <Utensils className="text-green-500" />,
  Box: <BoxIcon className="text-yellow-500" />,
  Wrench: <Wrench className="text-red-500" />,
};

const AdminDashboard = () => {
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
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { stats, resources, mealData, resourceData } = data;
  // Optionally, you can add a date picker and pass date to MealTypeDistribution
  // For now, it defaults to today if not provided

  return (
    <AdminLayout>
      <div className="min-h-screen p-6 space-y-6">
        {/* Heading */}
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={iconMap[stat.icon] || <BoxIcon />}
              chartData={{
                labels: stat.monthLabels || [],
                data: stat.monthlyData,
              }}
            />
          ))}
        </div>
        {/* Optimized Charts Row with 1:3:1 ratio */}
        <div className="grid items-stretch grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="flex flex-col h-full lg:col-span-1">
            <ResourceAllocation data={resourceData} />
          </div>
          <div className="flex flex-col h-full lg:col-span-3">
            <MealDistributionChart data={mealData} />
          </div>
          <div className="flex flex-col h-full lg:col-span-1">
            <MealTypeDistribution />
          </div>
        </div>
        <QuickActions actions={customUserActions} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
