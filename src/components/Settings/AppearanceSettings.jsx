import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';
import { Monitor } from 'lucide-react';
import { useThemeContext } from '../../theme/ThemeProvider';
import ThemeToggle from '../../layouts/shared/ThemeToggle';

const AppearanceSettings = () => {
  const { mode } = useThemeContext();

  return (
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
              <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto', alignItems: 'center', gap: 1 }}>
                <ThemeToggle variant="icon" size="large" />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              You are currently using <strong>{mode === 'light' ? 'Light' : 'Dark'}</strong> theme
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AppearanceSettings;
