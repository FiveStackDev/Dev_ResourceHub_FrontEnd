
import React, { useState } from 'react';
import ProfileSection from '../components/Settings/ProfileSettings';
import AccountSection from '../components/Settings/AccountSettings';
import OrganizationSection from '../components/Settings/OrganizationSettings';
import AdminLayout from '../layouts/Admin/AdminLayout';
import UserLayout from '../layouts/User/UserLayout';
import { Tabs, Tab, Box, Paper, Typography, Card, CardContent, Stack } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { useThemeContext } from '../theme/ThemeProvider';
import ThemeToggle from '../layouts/shared/ThemeToggle';
import { Palette, Monitor } from 'lucide-react';

const Settings = () => {
  // Get the user's role from context
  const { userData } = useUser();
  const userRole = userData.role;
  const { mode } = useThemeContext();

  // State to track which tab is active (0 = Profile, 1 = Account, 2 = Organization, 3 = Theme)
  const [tab, setTab] = useState(0);

  // Handler for changing tabs
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Theme Settings Component
  const ThemeSettings = () => (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Other Settings
      </Typography>
      
      <Stack spacing={3}>
      
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Monitor size={24} style={{ marginRight: 12, color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Appearance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column',margin:'auto' ,alignItems: 'center', gap: 1 }}>
                <ThemeToggle variant="icon" size="large" />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1,textAlign: 'center' }}>
              You are currently using <strong>{mode === 'light' ? 'Light' : 'Dark'}</strong> theme
            </Typography>

          </CardContent>
        </Card>
      </Stack>
    </Box>
  );

  // Common content for both Admin and User layouts
  const renderContent = (
    <Paper elevation={2} sx={{ width: '100%', mx: 'auto', p: 4 }}>
      <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

      {/* Tab navigation */}
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="Profile" />
        <Tab label="Account" />
        {userRole === 'Admin' && <Tab label="Organization" />}
        <Tab label="Theme" />
      </Tabs>

      {/* Tab content */}
      <Box>
        {tab === 0 && <ProfileSection />}
        {tab === 1 && <AccountSection />}
        {tab === 2 && userRole === 'Admin' && <OrganizationSection />}
        {(tab === 2 && userRole !== 'Admin') || (tab === 3) ? <ThemeSettings /> : null}
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
