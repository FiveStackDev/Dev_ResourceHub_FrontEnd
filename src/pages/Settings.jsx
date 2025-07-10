
import React, { useState } from 'react';
import ProfileSection from '../components/Settings/ProfileSettings';
import AccountSection from '../components/Settings/AccountSettings';
import OrganizationSection from '../components/Settings/OrganizationSettings';
import AdminLayout from '../layouts/Admin/AdminLayout';
import UserLayout from '../layouts/User/UserLayout';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const Settings = () => {

  // Get the user's role from context
  const { userData } = useUser();
  const userRole = userData.role;

  // State to track which tab is active (0 = Profile, 1 = Account)
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
           {userRole === 'Admin' && <Tab label="Organization" />}
      </Tabs>

      {/* Tab content */}
      <Box>
        {tab === 0 && <ProfileSection />}
        {tab === 1 && <AccountSection />}
        {tab === 2 && userRole === 'Admin' && <OrganizationSection />}
      </Box>
    </Paper>
  );

  // Layout conditional rendering based on role
  return (
    <>
      {userRole === 'Admin' ? (
        <AdminLayout>{renderContent}</AdminLayout>
      ) : userRole === 'User' ? (
        <UserLayout>{renderContent}</UserLayout>
      ) : (
        // If no valid role is found, show fallback
        <div className="max-w-2xl mx-auto p-4">
          <p>Please log in to view this page.</p>
        </div>
      )}
    </>
  );
};

export default Settings;
