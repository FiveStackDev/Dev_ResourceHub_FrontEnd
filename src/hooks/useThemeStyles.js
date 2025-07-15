import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

export const useThemeStyles = () => {
  const theme = useTheme();
  
  return useMemo(() => {
    const isDark = theme.palette.mode === 'dark';
    
    // Create a CSS class name that will be applied to components
    const themeClass = isDark ? 'dark-theme' : 'light-theme';
    
    // Apply theme CSS variables to the document root
    const updateCSSVariables = () => {
      const root = document.documentElement;
      
      if (isDark) {
        // Dark mode variables
        root.style.setProperty('--popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--popup-bg-secondary', '#252537');
        root.style.setProperty('--popup-text-primary', '#ffffff');
        root.style.setProperty('--popup-text-secondary', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--popup-border-color', '#374151');
        root.style.setProperty('--popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--popup-input-bg', '#2a2a3e');
        root.style.setProperty('--popup-input-border', '#374151');
        root.style.setProperty('--popup-input-border-hover', '#4b5563');
        root.style.setProperty('--popup-input-focus-shadow', 'rgba(59, 130, 246, 0.2)');
        root.style.setProperty('--popup-upload-bg-primary', '#2a2a3e');
        root.style.setProperty('--popup-upload-bg-secondary', '#374151');
        root.style.setProperty('--popup-upload-border', '#6b7280');
        root.style.setProperty('--popup-preview-bg', '#252537');
        root.style.setProperty('--popup-preview-border', '#374151');
        root.style.setProperty('--popup-button-cancel-bg', '#2a2a3e');
        root.style.setProperty('--popup-button-cancel-bg-hover', '#374151');
        root.style.setProperty('--popup-button-cancel-text', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--popup-button-cancel-border', '#374151');

        // Delete popup variables
        root.style.setProperty('--delete-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--delete-popup-bg-secondary', '#252537');
        root.style.setProperty('--delete-popup-text-primary', '#ffffff');
        root.style.setProperty('--delete-popup-text-secondary', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--delete-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--delete-warning-bg-primary', '#2a2a3e');
        root.style.setProperty('--delete-warning-bg-secondary', '#374151');
        root.style.setProperty('--delete-warning-border', '#4b5563');
        root.style.setProperty('--delete-error-bg-primary', '#3c1e1e');
        root.style.setProperty('--delete-error-bg-secondary', '#4a2222');
        root.style.setProperty('--delete-error-border', '#6b2d2d');
        root.style.setProperty('--delete-cancel-bg-primary', '#2a2a3e');
        root.style.setProperty('--delete-cancel-bg-secondary', '#374151');
        root.style.setProperty('--delete-cancel-text', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--delete-cancel-border', '#4b5563');
        root.style.setProperty('--delete-cancel-hover-bg', '#374151');
        root.style.setProperty('--delete-cancel-hover-text', '#ffffff');

        // Card variables
        root.style.setProperty('--card-bg-primary', '#1e1e2f');
        root.style.setProperty('--card-bg-secondary', '#252537');
        root.style.setProperty('--card-text-primary', '#ffffff');
        root.style.setProperty('--card-shadow', 'rgba(0, 0, 0, 0.2)');
        root.style.setProperty('--card-shadow-hover', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--card-border', '#374151');
        root.style.setProperty('--card-border-hover', '#4b5563');
        root.style.setProperty('--card-button-primary-bg', 'rgba(59, 130, 246, 0.15)');
        root.style.setProperty('--card-button-primary-border', '#3b82f6');
        root.style.setProperty('--card-button-primary-text', '#60a5fa');
        root.style.setProperty('--card-button-primary-hover-bg', 'rgba(59, 130, 246, 0.25)');
        root.style.setProperty('--card-button-primary-hover-border', '#60a5fa');
        root.style.setProperty('--card-button-primary-hover-text', '#93c5fd');
        root.style.setProperty('--card-button-error-bg', 'rgba(239, 68, 68, 0.15)');
        root.style.setProperty('--card-button-error-border', '#ef4444');
        root.style.setProperty('--card-button-error-text', '#f87171');
        root.style.setProperty('--card-button-error-hover-bg', 'rgba(239, 68, 68, 0.25)');
        root.style.setProperty('--card-button-error-hover-border', '#f87171');
        root.style.setProperty('--card-button-error-hover-text', '#fca5a5');
      } else {
        // Light mode variables
        root.style.setProperty('--popup-bg-primary', '#ffffff');
        root.style.setProperty('--popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--popup-text-primary', '#1e293b');
        root.style.setProperty('--popup-text-secondary', '#64748b');
        root.style.setProperty('--popup-border-color', '#f1f5f9');
        root.style.setProperty('--popup-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--popup-input-bg', '#ffffff');
        root.style.setProperty('--popup-input-border', '#e5e7eb');
        root.style.setProperty('--popup-input-border-hover', '#d1d5db');
        root.style.setProperty('--popup-input-focus-shadow', 'rgba(59, 130, 246, 0.1)');
        root.style.setProperty('--popup-upload-bg-primary', '#f3f4f6');
        root.style.setProperty('--popup-upload-bg-secondary', '#e5e7eb');
        root.style.setProperty('--popup-upload-border', '#9ca3af');
        root.style.setProperty('--popup-preview-bg', '#f8fafc');
        root.style.setProperty('--popup-preview-border', '#e2e8f0');
        root.style.setProperty('--popup-button-cancel-bg', '#ffffff');
        root.style.setProperty('--popup-button-cancel-bg-hover', '#f1f5f9');
        root.style.setProperty('--popup-button-cancel-text', '#64748b');
        root.style.setProperty('--popup-button-cancel-border', '#e2e8f0');

        // Delete popup variables
        root.style.setProperty('--delete-popup-bg-primary', '#ffffff');
        root.style.setProperty('--delete-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--delete-popup-text-primary', '#1f2937');
        root.style.setProperty('--delete-popup-text-secondary', '#6b7280');
        root.style.setProperty('--delete-popup-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--delete-warning-bg-primary', '#f8fafc');
        root.style.setProperty('--delete-warning-bg-secondary', '#f1f5f9');
        root.style.setProperty('--delete-warning-border', '#e2e8f0');
        root.style.setProperty('--delete-error-bg-primary', '#fef2f2');
        root.style.setProperty('--delete-error-bg-secondary', '#fee2e2');
        root.style.setProperty('--delete-error-border', '#fecaca');
        root.style.setProperty('--delete-cancel-bg-primary', '#f9fafb');
        root.style.setProperty('--delete-cancel-bg-secondary', '#f3f4f6');
        root.style.setProperty('--delete-cancel-text', '#6b7280');
        root.style.setProperty('--delete-cancel-border', '#e5e7eb');
        root.style.setProperty('--delete-cancel-hover-bg', '#f3f4f6');
        root.style.setProperty('--delete-cancel-hover-text', '#4b5563');

        // Card variables
        root.style.setProperty('--card-bg-primary', '#ffffff');
        root.style.setProperty('--card-bg-secondary', '#f8fafc');
        root.style.setProperty('--card-text-primary', '#1e293b');
        root.style.setProperty('--card-shadow', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--card-shadow-hover', 'rgba(0, 0, 0, 0.12)');
        root.style.setProperty('--card-border', '#e2e8f0');
        root.style.setProperty('--card-border-hover', '#cbd5e1');
        root.style.setProperty('--card-button-primary-bg', 'rgba(59, 130, 246, 0.05)');
        root.style.setProperty('--card-button-primary-border', '#3b82f6');
        root.style.setProperty('--card-button-primary-text', '#3b82f6');
        root.style.setProperty('--card-button-primary-hover-bg', 'rgba(59, 130, 246, 0.1)');
        root.style.setProperty('--card-button-primary-hover-border', '#2563eb');
        root.style.setProperty('--card-button-primary-hover-text', '#2563eb');
        root.style.setProperty('--card-button-error-bg', 'rgba(239, 68, 68, 0.05)');
        root.style.setProperty('--card-button-error-border', '#ef4444');
        root.style.setProperty('--card-button-error-text', '#ef4444');
        root.style.setProperty('--card-button-error-hover-bg', 'rgba(239, 68, 68, 0.1)');
        root.style.setProperty('--card-button-error-hover-border', '#dc2626');
        root.style.setProperty('--card-button-error-hover-text', '#dc2626');
      }
    };
    
    return {
      themeClass,
      updateCSSVariables,
      isDark
    };
  }, [theme.palette.mode]);
};
