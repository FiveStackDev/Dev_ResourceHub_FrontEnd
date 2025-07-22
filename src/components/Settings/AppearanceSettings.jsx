import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  TextField, 
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import { Monitor, Clock, Palette } from 'lucide-react';
import { useThemeContext } from '../../theme/ThemeProvider';
import ThemeToggle from '../../layouts/shared/ThemeToggle';

const AppearanceSettings = () => {
  const { mode, toggleMode, setMode } = useThemeContext();
  const [scheduled, setScheduled] = useState(() => {
    const saved = localStorage.getItem('darkModeScheduled');
    return saved === 'true';
  });
  
  const [darkModeStart, setDarkModeStart] = useState(() => {
    const saved = localStorage.getItem('darkModeStart');
    return saved || '19:00';
  });
  
  const [darkModeEnd, setDarkModeEnd] = useState(() => {
    const saved = localStorage.getItem('darkModeEnd');
    return saved || '07:00';
  });

  // Helper to check if current time is in dark mode range
  const isDarkTime = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = darkModeStart.split(':').map(Number);
    const [endHour, endMin] = darkModeEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      // Overnight range (e.g., 19:00 to 07:00)
      return currentTime >= startTime || currentTime < endTime;
    } else {
      // Same day range (e.g., 12:00 to 14:00)
      return currentTime >= startTime && currentTime < endTime;
    }
  };

  // Apply theme based on schedule
  const applyScheduledTheme = useCallback(() => {
    if (scheduled) {
      const shouldBeDark = isDarkTime();
      setMode(shouldBeDark ? 'dark' : 'light');
      localStorage.setItem('currentScheduledTheme', shouldBeDark ? 'dark' : 'light');
    }
  }, [scheduled, darkModeStart, darkModeEnd, setMode]);

  // On mount, apply scheduled theme if enabled
  useEffect(() => {
    applyScheduledTheme();
  }, [applyScheduledTheme]); // Include applyScheduledTheme in dependencies

  // When schedule settings change, save to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem('darkModeScheduled', scheduled.toString());
    localStorage.setItem('darkModeStart', darkModeStart);
    localStorage.setItem('darkModeEnd', darkModeEnd);
    applyScheduledTheme();
  }, [scheduled, darkModeStart, darkModeEnd, applyScheduledTheme]); // Dependencies for settings changes

  // Check and update theme every minute when scheduled
  useEffect(() => {
    if (!scheduled) return;
    
    const interval = setInterval(() => {
      applyScheduledTheme();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [scheduled, applyScheduledTheme]); // Re-create interval when settings change

  const handleScheduleToggle = () => {
    setScheduled(prev => !prev);
  };

  const handleTimeChange = (type, value) => {
    if (type === 'start') {
      setDarkModeStart(value);
    } else {
      setDarkModeEnd(value);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Palette size={28} />
        Appearance Settings
      </Typography>
      
      <Stack spacing={3}>
        {/* Manual Theme Control Card */}
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Monitor size={24} style={{ marginRight: 12, color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Theme Control
              </Typography>
              <Chip 
                label={mode === 'light' ? 'Light' : 'Dark'} 
                color={mode === 'light' ? 'default' : 'primary'}
                size="small"
                sx={{ ml: 'auto', fontWeight: 600 }}
              />
            </Box>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  bgcolor: mode === 'light' ? 'grey.50' : 'grey.900',
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider'
                }}>
                  <ThemeToggle variant="icon" size="large" disabled={scheduled} />
                  <Typography 
                    variant="body2" 
                    color={scheduled ? 'text.disabled' : 'text.secondary'}
                    sx={{ textAlign: 'center' }}
                  >
                    {scheduled ? 'Manual toggle disabled during scheduling' : 'Click to toggle theme'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    bgcolor: mode === 'light' ? 'primary.50' : 'primary.900',
                    border: 1,
                    borderColor: mode === 'light' ? 'primary.200' : 'primary.700'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Current Status:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {scheduled
                      ? `Auto-scheduled: ${isDarkTime() ? 'Dark' : 'Light'} mode`
                      : `Manual: ${mode === 'light' ? 'Light' : 'Dark'} mode`}
                  </Typography>
                  {scheduled && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Schedule: {darkModeStart} - {darkModeEnd}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Schedule Settings Card */}
        <Card elevation={2} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Clock size={24} style={{ marginRight: 12, color: '#10b981' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Automatic Theme Scheduling
              </Typography>
              <Chip 
                label={scheduled ? 'Active' : 'Inactive'} 
                color={scheduled ? 'success' : 'default'}
                size="small"
                sx={{ ml: 'auto', fontWeight: 600 }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={scheduled}
                  onChange={handleScheduleToggle}
                  color="primary"
                  size="medium"
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Enable automatic theme scheduling
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically switch between light and dark themes based on time of day
                  </Typography>
                </Box>
              }
              sx={{ mb: scheduled ? 3 : 0, alignItems: 'flex-start' }}
            />
            
            {scheduled && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Schedule Configuration
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Dark mode starts"
                      type="time"
                      value={darkModeStart}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      to
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      label="Dark mode ends"
                      type="time"
                      value={darkModeEnd}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Paper 
                  elevation={0} 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: 'info.50', 
                    border: 1, 
                    borderColor: 'info.200',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="info.main" sx={{ fontWeight: 500 }}>
                    💡 Schedule Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Dark theme will be active from {darkModeStart} to {darkModeEnd}.
                    {darkModeStart > darkModeEnd ? ' This schedule spans overnight.' : ' This schedule is within the same day.'}
                  </Typography>
                </Paper>
              </>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AppearanceSettings;
