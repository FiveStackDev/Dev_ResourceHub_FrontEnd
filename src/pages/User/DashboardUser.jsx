import React, { useState, useEffect, useCallback } from 'react';
import {
  Utensils,
  Box as BoxIcon,
  Wrench,
  CalendarDays,
  PackageCheck,
} from 'lucide-react';
import axios from 'axios';
import UserLayout from '../../layouts/User/UserLayout';
import { StatCard } from '../../components/Dashboard/User/StatCard';
import { RecentActivities } from '../../components/Dashboard/User/RecentActivities';
import { QuickActions } from '../../components/Dashboard/Common/QuickActions';
import { getMonthLabels } from '../../utils/dateUtils';
import { useUserDashboardData } from '../../query/userDashboardQueries';

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

const iconMap = {
  Utensils: <Utensils className="text-green-500" />,
  Box: <BoxIcon className="text-yellow-500" />,
  Wrench: <Wrench className="text-red-500" />,
};

const DashboardUser = () => {
  // Use dynamic month labels from backend if available
  const { data, isLoading, isError, error, refetch } = useUserDashboardData();

  if (isLoading) {
    return (
      <UserLayout>
        <div className="p-2">Loading dashboard...</div>
      </UserLayout>
    );
  }

  if (isError) {
    return (
      <UserLayout>
        <div className="p-2 text-red-500">
          {error?.message ||
            'Failed to load dashboard data. Please try again later.'}
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </UserLayout>
    );
  }

  const { stats, recentActivities } = data;

  return (
    <UserLayout>
      <div className="min-h-screen space-y-3 p-1 sm:p-2">
        {/* Heading */}
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={iconMap[stat.icon] || <BoxIcon />}
              chartData={{
                labels: stat.monthLabels || [],
                data: stat.monthlyData || [],
              }}
            />
          ))}
        </div>
        {/* Recent Activities */}
        <RecentActivities activities={recentActivities} />
        {/* Quick Actions */}
        <QuickActions actions={customUserActions} />
      </div>
    </UserLayout>
  );
};

export default DashboardUser;
