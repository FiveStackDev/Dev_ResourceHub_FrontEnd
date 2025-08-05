import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
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
  const getScheduleSettings = useCallback(() => {
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
  }, []);

  // Detect system theme preference on initial load theme
  const getInitialMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      const scheduleSettings = getScheduleSettings();
      if (scheduleSettings.enabled) {
        return isDarkTime(scheduleSettings.startTime, scheduleSettings.endTime)
          ? 'dark'
          : 'light';
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
  }, [getScheduleSettings]);

  const [mode, setMode] = useState<'light' | 'dark'>(() => getInitialMode());

  const toggleMode = useCallback(() => {
    const scheduleSettings = getScheduleSettings();
    if (scheduleSettings.enabled) {
      // Don't allow manual toggle when scheduling is enabled
      return;
    }

    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  }, [getScheduleSettings]);

  const setModeDirectly = useCallback((newMode: 'light' | 'dark') => {
    setMode(newMode);
  }, []);

  // Check and apply scheduled theme
  const checkAndApplyScheduledTheme = useCallback(() => {
    const scheduleSettings = getScheduleSettings();
    if (scheduleSettings.enabled) {
      const shouldBeDark = isDarkTime(
        scheduleSettings.startTime,
        scheduleSettings.endTime,
      );
      const newMode = shouldBeDark ? 'dark' : 'light';
      setMode((currentMode) => {
        if (currentMode !== newMode) {
          return newMode;
        }
        return currentMode;
      });
    }
  }, [getScheduleSettings]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  // Effect for theme scheduling - this is the main scheduling logic
  useEffect(() => {
    // Check theme immediately on mount
    checkAndApplyScheduledTheme();

    // Set up interval to check every minute (60 seconds)
    const interval = setInterval(checkAndApplyScheduledTheme, 60000);

    // Listen for localStorage changes (when settings are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'themeSchedule') {
        checkAndApplyScheduledTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAndApplyScheduledTheme]);

  const contextValue = useMemo(
    () => ({ mode, toggleMode, setMode: setModeDirectly }),
    [mode, toggleMode, setModeDirectly],
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
