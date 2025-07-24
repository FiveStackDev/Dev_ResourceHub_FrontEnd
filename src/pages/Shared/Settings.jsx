
import React, { useState } from 'react';
import ProfileSection from './../../components/Settings/Profile/ProfileSettings';
import AccountSection from './../../components/Settings/Account/AccountSettings';
import OrganizationSection from './../../components/Settings/Organization/OrganizationSettings';
import AdminLayout from './../../layouts/Admin/AdminLayout';
import UserLayout from './../../layouts/User/UserLayout';
import { Tabs, Tab, Box, Paper, Typography, Card, CardContent, Stack } from '@mui/material';
import { useUser } from './../../contexts/UserContext';
import AppearanceSettings from './../../components/Settings/Appearance/AppearanceSettings';
import { Navigate } from 'react-router-dom';

const Settings = () => {
  // Get the user's role from context
  const { userData } = useUser();
  const userRole = userData.role;


  // State to track which tab is active (0 = Profile, 1 = Account, 2 = Organization, 3 = Theme)
  const [tab, setTab] = useState(0);

  // Handler for changing tabs
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };



  // Common content for both Admin and User layouts
  const renderContent = (
    <Paper elevation={2} sx={{ width: '100%', mx: 'auto', p: 4 }}>
      <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

      {/* Tab navigation */}
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Profile" />
        <Tab label="Account" />
        {(userRole === 'SuperAdmin') && <Tab label="Organization" />}
        <Tab label="Theme" />
      </Tabs>

      {/* Tab content */}
      <Box>
        {tab === 0 && <ProfileSection />}
        {tab === 1 && <AccountSection />}
        {tab === 2 && (userRole === 'SuperAdmin') && <OrganizationSection />}
        {((tab === 2 && userRole !== 'SuperAdmin') || (tab === 3)) ? <AppearanceSettings /> : null}
      </Box>
    </Paper>
  );

  // Layout conditional rendering based on role
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {userRole === 'Admin' || userRole === 'SuperAdmin' ? (
        <AdminLayout>{renderContent}</AdminLayout>
      ) : userRole === 'User' ? (
        <UserLayout>{renderContent}</UserLayout>
      ) : (
        <div className="max-w-2xl mx-auto p-4">
          <p>Please log in to view this page.</p>
        </div>
      )}
    </>
  );
};

export default Settings;
