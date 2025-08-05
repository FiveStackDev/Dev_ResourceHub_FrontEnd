import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

// Helper to check if current time is in dark mode range
const isDarkTime = (startTime: string, endTime: string) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes > endMinutes) {
    // Overnight range (e.g., 19:00 to 07:00)
    return currentTime >= startMinutes || currentTime < endMinutes;
  } else {
    // Same day range (e.g., 12:00 to 14:00)
    return currentTime >= startMinutes && currentTime < endMinutes;
  }
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleMode: () => {},
  setMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get schedule settings from localStorage
  const getScheduleSettings = () => {
    const saved = localStorage.getItem('themeSchedule');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse theme schedule settings');
      }
    }
    return {
      enabled: false,
      startTime: '19:00',
      endTime: '07:00',
    };
  };

  // Detect system theme preference on initial load theme
  const getInitialMode = () => {
    if (typeof window !== 'undefined') {
      const scheduleSettings = getScheduleSettings();
      if (scheduleSettings.enabled) {
        return isDarkTime(scheduleSettings.startTime, scheduleSettings.endTime) ? 'dark' : 'light';
      }
      // Check localStorage for saved theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Fall back to system preference
      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
    }
    return 'light';
  };
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode());

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Only save to localStorage if not scheduled
      const isScheduled = localStorage.getItem('darkModeScheduled') === 'true';
      if (!isScheduled) {
        localStorage.setItem('theme', newMode);
      }
      return newMode;
    });
  };

  const setModeDirectly = (newMode: 'light' | 'dark') => {
    setMode(newMode);
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Effect for theme scheduling
  useEffect(() => {
    const checkAndApplyScheduledTheme = () => {
      const scheduleSettings = getScheduleSettings();
      if (scheduleSettings.enabled) {
        const shouldBeDark = isDarkTime(scheduleSettings.startTime, scheduleSettings.endTime);
        const newMode = shouldBeDark ? 'dark' : 'light';
        if (mode !== newMode) {
          setMode(newMode);
        }
      }
    };

    // Check theme immediately
    checkAndApplyScheduledTheme();

    // Set up interval to check every 50 seconds
    const interval = setInterval(checkAndApplyScheduledTheme, 50000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [mode]); // Re-run effect if mode changes

  const contextValue = useMemo(
    () => ({ mode, toggleMode, setMode: setModeDirectly }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
