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
        root.style.setProperty(
          '--popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--popup-border-color', '#374151');
        root.style.setProperty('--popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--popup-input-bg', '#2a2a3e');
        root.style.setProperty('--popup-input-border', '#374151');
        root.style.setProperty('--popup-input-border-hover', '#4b5563');
        root.style.setProperty(
          '--popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.2)',
        );
        root.style.setProperty('--popup-upload-bg-primary', '#2a2a3e');
        root.style.setProperty('--popup-upload-bg-secondary', '#374151');
        root.style.setProperty('--popup-upload-border', '#6b7280');
        root.style.setProperty('--popup-preview-bg', '#252537');
        root.style.setProperty('--popup-preview-border', '#374151');
        root.style.setProperty('--popup-button-cancel-bg', '#2a2a3e');
        root.style.setProperty('--popup-button-cancel-bg-hover', '#374151');
        root.style.setProperty(
          '--popup-button-cancel-text',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--popup-button-cancel-border', '#374151');

        // Delete popup variables
        root.style.setProperty('--delete-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--delete-popup-bg-secondary', '#252537');
        root.style.setProperty('--delete-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--delete-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--delete-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--delete-warning-bg-primary', '#2a2a3e');
        root.style.setProperty('--delete-warning-bg-secondary', '#374151');
        root.style.setProperty('--delete-warning-border', '#4b5563');
        root.style.setProperty('--delete-error-bg-primary', '#3c1e1e');
        root.style.setProperty('--delete-error-bg-secondary', '#4a2222');
        root.style.setProperty('--delete-error-border', '#6b2d2d');
        root.style.setProperty('--delete-cancel-bg-primary', '#2a2a3e');
        root.style.setProperty('--delete-cancel-bg-secondary', '#374151');
        root.style.setProperty(
          '--delete-cancel-text',
          'rgba(255, 255, 255, 0.7)',
        );
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
        root.style.setProperty(
          '--card-button-primary-bg',
          'rgba(59, 130, 246, 0.15)',
        );
        root.style.setProperty('--card-button-primary-border', '#3b82f6');
        root.style.setProperty('--card-button-primary-text', '#60a5fa');
        root.style.setProperty(
          '--card-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.25)',
        );
        root.style.setProperty('--card-button-primary-hover-border', '#60a5fa');
        root.style.setProperty('--card-button-primary-hover-text', '#93c5fd');
        root.style.setProperty(
          '--card-button-error-bg',
          'rgba(239, 68, 68, 0.15)',
        );
        root.style.setProperty('--card-button-error-border', '#ef4444');
        root.style.setProperty('--card-button-error-text', '#f87171');
        root.style.setProperty(
          '--card-button-error-hover-bg',
          'rgba(239, 68, 68, 0.25)',
        );
        root.style.setProperty('--card-button-error-hover-border', '#f87171');
        root.style.setProperty('--card-button-error-hover-text', '#fca5a5');

        // User dialog variables
        root.style.setProperty('--user-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--user-popup-bg-secondary', '#252537');
        root.style.setProperty('--user-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--user-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--user-popup-border-color', '#374151');
        root.style.setProperty('--user-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--user-popup-input-bg', '#2a2a3e');
        root.style.setProperty('--user-popup-input-border', '#374151');
        root.style.setProperty('--user-popup-input-border-hover', '#4b5563');
        root.style.setProperty(
          '--user-popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.2)',
        );
        root.style.setProperty('--user-popup-select-bg', '#2a2a3e');
        root.style.setProperty('--user-popup-select-border', '#374151');
        root.style.setProperty('--user-popup-button-cancel-bg', '#2a2a3e');
        root.style.setProperty(
          '--user-popup-button-cancel-bg-hover',
          '#374151',
        );
        root.style.setProperty(
          '--user-popup-button-cancel-text',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--user-popup-button-cancel-border', '#374151');
        root.style.setProperty('--user-delete-warning-bg-primary', '#2a2a3e');
        root.style.setProperty('--user-delete-warning-bg-secondary', '#374151');
        root.style.setProperty('--user-delete-warning-border', '#4b5563');
        root.style.setProperty('--user-delete-error-bg-primary', '#3c1e1e');
        root.style.setProperty('--user-delete-error-bg-secondary', '#4a2222');
        root.style.setProperty('--user-delete-error-border', '#6b2d2d');

        // Maintenance dialog variables
        root.style.setProperty('--maintenance-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--maintenance-popup-bg-secondary', '#252537');
        root.style.setProperty('--maintenance-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--maintenance-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--maintenance-popup-border-color', '#374151');
        root.style.setProperty(
          '--maintenance-popup-shadow',
          'rgba(0, 0, 0, 0.3)',
        );
        root.style.setProperty('--maintenance-popup-input-bg', '#2a2a3e');
        root.style.setProperty('--maintenance-popup-input-border', '#374151');
        root.style.setProperty(
          '--maintenance-popup-input-border-hover',
          '#4b5563',
        );
        root.style.setProperty(
          '--maintenance-popup-input-focus-shadow',
          'rgba(245, 158, 11, 0.2)',
        );
        root.style.setProperty('--maintenance-popup-select-bg', '#2a2a3e');
        root.style.setProperty('--maintenance-popup-select-border', '#374151');
        root.style.setProperty(
          '--maintenance-popup-button-cancel-bg',
          '#2a2a3e',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-bg-hover',
          '#374151',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-text',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-border',
          '#374151',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-bg-primary',
          '#2a2a3e',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-bg-secondary',
          '#374151',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-border',
          '#4b5563',
        );
        root.style.setProperty(
          '--maintenance-delete-error-bg-primary',
          '#3c1e1e',
        );
        root.style.setProperty(
          '--maintenance-delete-error-bg-secondary',
          '#4a2222',
        );
        root.style.setProperty('--maintenance-delete-error-border', '#6b2d2d');

        // Calendar component variables
        root.style.setProperty('--calendar-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--calendar-popup-bg-secondary', '#252537');
        root.style.setProperty('--calendar-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--calendar-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--calendar-popup-border-color', '#374151');
        root.style.setProperty('--calendar-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--calendar-card-bg-primary', '#1e1e2f');
        root.style.setProperty('--calendar-card-bg-secondary', '#252537');
        root.style.setProperty('--calendar-card-text-primary', '#ffffff');
        root.style.setProperty('--calendar-card-shadow', 'rgba(0, 0, 0, 0.2)');
        root.style.setProperty(
          '--calendar-card-shadow-hover',
          'rgba(0, 0, 0, 0.3)',
        );
        root.style.setProperty('--calendar-card-border', '#374151');
        root.style.setProperty('--calendar-card-border-hover', '#4b5563');
        root.style.setProperty(
          '--calendar-button-primary-bg',
          'rgba(34, 197, 94, 0.15)',
        );
        root.style.setProperty('--calendar-button-primary-border', '#22c55e');
        root.style.setProperty('--calendar-button-primary-text', '#4ade80');
        root.style.setProperty(
          '--calendar-button-primary-hover-bg',
          'rgba(34, 197, 94, 0.25)',
        );
        root.style.setProperty(
          '--calendar-button-primary-hover-border',
          '#4ade80',
        );
        root.style.setProperty(
          '--calendar-button-primary-hover-text',
          '#86efac',
        );
        root.style.setProperty(
          '--calendar-button-secondary-bg',
          'rgba(59, 130, 246, 0.15)',
        );
        root.style.setProperty('--calendar-button-secondary-border', '#3b82f6');
        root.style.setProperty('--calendar-button-secondary-text', '#60a5fa');
        root.style.setProperty(
          '--calendar-button-secondary-hover-bg',
          'rgba(59, 130, 246, 0.25)',
        );
        root.style.setProperty(
          '--calendar-button-secondary-hover-border',
          '#60a5fa',
        );
        root.style.setProperty(
          '--calendar-button-secondary-hover-text',
          '#93c5fd',
        );
        root.style.setProperty(
          '--calendar-delete-warning-bg-primary',
          '#2a2a3e',
        );
        root.style.setProperty(
          '--calendar-delete-warning-bg-secondary',
          '#374151',
        );
        root.style.setProperty('--calendar-delete-warning-border', '#4b5563');
        root.style.setProperty('--calendar-delete-error-bg-primary', '#3c1e1e');
        root.style.setProperty(
          '--calendar-delete-error-bg-secondary',
          '#4a2222',
        );
        root.style.setProperty('--calendar-delete-error-border', '#6b2d2d');

        // Asset component variables
        root.style.setProperty('--asset-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--asset-popup-bg-secondary', '#252537');
        root.style.setProperty('--asset-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--asset-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--asset-popup-border-color', '#374151');
        root.style.setProperty('--asset-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--asset-card-bg-primary', '#1e1e2f');
        root.style.setProperty('--asset-card-bg-secondary', '#252537');
        root.style.setProperty('--asset-card-text-primary', '#ffffff');
        root.style.setProperty('--asset-card-shadow', 'rgba(0, 0, 0, 0.2)');
        root.style.setProperty(
          '--asset-card-shadow-hover',
          'rgba(0, 0, 0, 0.3)',
        );
        root.style.setProperty('--asset-card-border', '#374151');
        root.style.setProperty('--asset-card-border-hover', '#4b5563');
        root.style.setProperty(
          '--asset-button-primary-bg',
          'rgba(59, 130, 246, 0.15)',
        );
        root.style.setProperty('--asset-button-primary-border', '#3b82f6');
        root.style.setProperty('--asset-button-primary-text', '#60a5fa');
        root.style.setProperty(
          '--asset-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.25)',
        );
        root.style.setProperty(
          '--asset-button-primary-hover-border',
          '#60a5fa',
        );
        root.style.setProperty('--asset-button-primary-hover-text', '#93c5fd');
        root.style.setProperty(
          '--asset-button-secondary-bg',
          'rgba(99, 102, 241, 0.15)',
        );
        root.style.setProperty('--asset-button-secondary-border', '#6366f1');
        root.style.setProperty('--asset-button-secondary-text', '#a5b4fc');
        root.style.setProperty(
          '--asset-button-secondary-hover-bg',
          'rgba(99, 102, 241, 0.25)',
        );
        root.style.setProperty(
          '--asset-button-secondary-hover-border',
          '#a5b4fc',
        );
        root.style.setProperty(
          '--asset-button-secondary-hover-text',
          '#c7d2fe',
        );
        root.style.setProperty('--asset-delete-warning-bg-primary', '#2a2a3e');
        root.style.setProperty(
          '--asset-delete-warning-bg-secondary',
          '#374151',
        );
        root.style.setProperty('--asset-delete-warning-border', '#4b5563');
        root.style.setProperty('--asset-delete-error-bg-primary', '#3c1e1e');
        root.style.setProperty('--asset-delete-error-bg-secondary', '#4a2222');
        root.style.setProperty('--asset-delete-error-border', '#6b2d2d');
        root.style.setProperty('--asset-input-bg', '#2a2a3e');
        root.style.setProperty('--asset-input-border', '#374151');
        root.style.setProperty('--asset-input-border-hover', '#4b5563');
        root.style.setProperty(
          '--asset-input-focus-shadow',
          'rgba(59, 130, 246, 0.2)',
        );

        // Settings Theme Variables (Blue/Indigo) - Dark Mode
        root.style.setProperty('--settings-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--settings-popup-bg-secondary', '#252537');
        root.style.setProperty('--settings-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--settings-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--settings-popup-border-color', '#374151');
        root.style.setProperty('--settings-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--settings-card-bg-primary', '#1e1e2f');
        root.style.setProperty('--settings-card-bg-secondary', '#252537');
        root.style.setProperty('--settings-card-text-primary', '#ffffff');
        root.style.setProperty('--settings-card-border', '#374151');
        root.style.setProperty('--settings-card-shadow', 'rgba(0, 0, 0, 0.2)');
        root.style.setProperty(
          '--settings-button-primary-bg',
          'rgba(59, 130, 246, 0.15)',
        );
        root.style.setProperty('--settings-button-primary-border', '#3b82f6');
        root.style.setProperty('--settings-button-primary-text', '#60a5fa');
        root.style.setProperty(
          '--settings-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.25)',
        );
        root.style.setProperty(
          '--settings-button-primary-hover-border',
          '#60a5fa',
        );
        root.style.setProperty(
          '--settings-button-primary-hover-text',
          '#93c5fd',
        );
        root.style.setProperty(
          '--settings-button-secondary-bg',
          'rgba(99, 102, 241, 0.15)',
        );
        root.style.setProperty('--settings-button-secondary-border', '#6366f1');
        root.style.setProperty('--settings-button-secondary-text', '#a5b4fc');
        root.style.setProperty(
          '--settings-button-secondary-hover-bg',
          'rgba(99, 102, 241, 0.25)',
        );
        root.style.setProperty(
          '--settings-button-secondary-hover-border',
          '#a5b4fc',
        );
        root.style.setProperty(
          '--settings-button-secondary-hover-text',
          '#c7d2fe',
        );
        root.style.setProperty('--settings-input-bg', '#2a2a3e');
        root.style.setProperty('--settings-input-border', '#374151');
        root.style.setProperty('--settings-input-border-hover', '#4b5563');
        root.style.setProperty(
          '--settings-input-focus-shadow',
          'rgba(59, 130, 246, 0.2)',
        );
        root.style.setProperty('--settings-popup-input-bg', '#2a2a3e');
        root.style.setProperty('--settings-popup-input-border', '#374151');
        root.style.setProperty(
          '--settings-popup-input-border-hover',
          '#4b5563',
        );
        root.style.setProperty(
          '--settings-popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.2)',
        );
        root.style.setProperty('--settings-popup-button-cancel-bg', '#2a2a3e');
        root.style.setProperty(
          '--settings-popup-button-cancel-bg-hover',
          '#374151',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-text',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-border',
          '#374151',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-border-hover',
          '#4b5563',
        );
        root.style.setProperty('--settings-accent-primary', '#3b82f6');
        root.style.setProperty('--settings-accent-secondary', '#2563eb');
        root.style.setProperty('--settings-accent-tertiary', '#1d4ed8');

        // Report Theme Variables (Blue) - Dark Mode
        root.style.setProperty('--report-popup-bg-primary', '#1e1e2f');
        root.style.setProperty('--report-popup-bg-secondary', '#252537');
        root.style.setProperty('--report-popup-text-primary', '#ffffff');
        root.style.setProperty(
          '--report-popup-text-secondary',
          'rgba(255, 255, 255, 0.7)',
        );
        root.style.setProperty('--report-popup-border-color', '#374151');
        root.style.setProperty('--report-popup-shadow', 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--report-popup-accent-primary', '#3b82f6');
        root.style.setProperty('--report-popup-accent-secondary', '#2563eb');
        root.style.setProperty('--report-popup-card-bg', '#2a2a3e');
        root.style.setProperty('--report-popup-card-border', '#374151');
        root.style.setProperty('--report-popup-card-hover-bg', '#374151');
        root.style.setProperty('--report-popup-card-hover-border', '#3b82f6');
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
        root.style.setProperty(
          '--popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.1)',
        );
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
        root.style.setProperty(
          '--card-button-primary-bg',
          'rgba(59, 130, 246, 0.05)',
        );
        root.style.setProperty('--card-button-primary-border', '#3b82f6');
        root.style.setProperty('--card-button-primary-text', '#3b82f6');
        root.style.setProperty(
          '--card-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty('--card-button-primary-hover-border', '#2563eb');
        root.style.setProperty('--card-button-primary-hover-text', '#2563eb');
        root.style.setProperty(
          '--card-button-error-bg',
          'rgba(239, 68, 68, 0.05)',
        );
        root.style.setProperty('--card-button-error-border', '#ef4444');
        root.style.setProperty('--card-button-error-text', '#ef4444');
        root.style.setProperty(
          '--card-button-error-hover-bg',
          'rgba(239, 68, 68, 0.1)',
        );
        root.style.setProperty('--card-button-error-hover-border', '#dc2626');
        root.style.setProperty('--card-button-error-hover-text', '#dc2626');

        // User dialog variables
        root.style.setProperty('--user-popup-bg-primary', '#ffffff');
        root.style.setProperty('--user-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--user-popup-text-primary', '#1e293b');
        root.style.setProperty('--user-popup-text-secondary', '#64748b');
        root.style.setProperty('--user-popup-border-color', '#f1f5f9');
        root.style.setProperty('--user-popup-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--user-popup-input-bg', '#ffffff');
        root.style.setProperty('--user-popup-input-border', '#e5e7eb');
        root.style.setProperty('--user-popup-input-border-hover', '#d1d5db');
        root.style.setProperty(
          '--user-popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty('--user-popup-select-bg', '#ffffff');
        root.style.setProperty('--user-popup-select-border', '#e5e7eb');
        root.style.setProperty('--user-popup-button-cancel-bg', '#ffffff');
        root.style.setProperty(
          '--user-popup-button-cancel-bg-hover',
          '#f1f5f9',
        );
        root.style.setProperty('--user-popup-button-cancel-text', '#64748b');
        root.style.setProperty('--user-popup-button-cancel-border', '#e2e8f0');
        root.style.setProperty('--user-delete-warning-bg-primary', '#f8fafc');
        root.style.setProperty('--user-delete-warning-bg-secondary', '#f1f5f9');
        root.style.setProperty('--user-delete-warning-border', '#e2e8f0');
        root.style.setProperty('--user-delete-error-bg-primary', '#fef2f2');
        root.style.setProperty('--user-delete-error-bg-secondary', '#fee2e2');
        root.style.setProperty('--user-delete-error-border', '#fecaca');

        // Maintenance dialog variables
        root.style.setProperty('--maintenance-popup-bg-primary', '#ffffff');
        root.style.setProperty('--maintenance-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--maintenance-popup-text-primary', '#1e293b');
        root.style.setProperty('--maintenance-popup-text-secondary', '#64748b');
        root.style.setProperty('--maintenance-popup-border-color', '#f1f5f9');
        root.style.setProperty(
          '--maintenance-popup-shadow',
          'rgba(0, 0, 0, 0.15)',
        );
        root.style.setProperty('--maintenance-popup-input-bg', '#ffffff');
        root.style.setProperty('--maintenance-popup-input-border', '#e5e7eb');
        root.style.setProperty(
          '--maintenance-popup-input-border-hover',
          '#d1d5db',
        );
        root.style.setProperty(
          '--maintenance-popup-input-focus-shadow',
          'rgba(245, 158, 11, 0.1)',
        );
        root.style.setProperty('--maintenance-popup-select-bg', '#ffffff');
        root.style.setProperty('--maintenance-popup-select-border', '#e5e7eb');
        root.style.setProperty(
          '--maintenance-popup-button-cancel-bg',
          '#ffffff',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-bg-hover',
          '#f1f5f9',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-text',
          '#64748b',
        );
        root.style.setProperty(
          '--maintenance-popup-button-cancel-border',
          '#e2e8f0',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-bg-primary',
          '#f8fafc',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-bg-secondary',
          '#f1f5f9',
        );
        root.style.setProperty(
          '--maintenance-delete-warning-border',
          '#e2e8f0',
        );
        root.style.setProperty(
          '--maintenance-delete-error-bg-primary',
          '#fef2f2',
        );
        root.style.setProperty(
          '--maintenance-delete-error-bg-secondary',
          '#fee2e2',
        );
        root.style.setProperty('--maintenance-delete-error-border', '#fecaca');

        // Calendar component variables
        root.style.setProperty('--calendar-popup-bg-primary', '#ffffff');
        root.style.setProperty('--calendar-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--calendar-popup-text-primary', '#1e293b');
        root.style.setProperty('--calendar-popup-text-secondary', '#64748b');
        root.style.setProperty('--calendar-popup-border-color', '#f1f5f9');
        root.style.setProperty(
          '--calendar-popup-shadow',
          'rgba(0, 0, 0, 0.15)',
        );
        root.style.setProperty('--calendar-card-bg-primary', '#ffffff');
        root.style.setProperty('--calendar-card-bg-secondary', '#f8fafc');
        root.style.setProperty('--calendar-card-text-primary', '#1e293b');
        root.style.setProperty('--calendar-card-shadow', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty(
          '--calendar-card-shadow-hover',
          'rgba(0, 0, 0, 0.12)',
        );
        root.style.setProperty('--calendar-card-border', '#e2e8f0');
        root.style.setProperty('--calendar-card-border-hover', '#cbd5e1');
        root.style.setProperty(
          '--calendar-button-primary-bg',
          'rgba(34, 197, 94, 0.05)',
        );
        root.style.setProperty('--calendar-button-primary-border', '#22c55e');
        root.style.setProperty('--calendar-button-primary-text', '#22c55e');
        root.style.setProperty(
          '--calendar-button-primary-hover-bg',
          'rgba(34, 197, 94, 0.1)',
        );
        root.style.setProperty(
          '--calendar-button-primary-hover-border',
          '#16a34a',
        );
        root.style.setProperty(
          '--calendar-button-primary-hover-text',
          '#16a34a',
        );
        root.style.setProperty(
          '--calendar-button-secondary-bg',
          'rgba(59, 130, 246, 0.05)',
        );
        root.style.setProperty('--calendar-button-secondary-border', '#3b82f6');
        root.style.setProperty('--calendar-button-secondary-text', '#3b82f6');
        root.style.setProperty(
          '--calendar-button-secondary-hover-bg',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty(
          '--calendar-button-secondary-hover-border',
          '#2563eb',
        );
        root.style.setProperty(
          '--calendar-button-secondary-hover-text',
          '#2563eb',
        );
        root.style.setProperty(
          '--calendar-delete-warning-bg-primary',
          '#f8fafc',
        );
        root.style.setProperty(
          '--calendar-delete-warning-bg-secondary',
          '#f1f5f9',
        );
        root.style.setProperty('--calendar-delete-warning-border', '#e2e8f0');
        root.style.setProperty('--calendar-delete-error-bg-primary', '#fef2f2');
        root.style.setProperty(
          '--calendar-delete-error-bg-secondary',
          '#fee2e2',
        );
        root.style.setProperty('--calendar-delete-error-border', '#fecaca');

        // Asset component variables
        root.style.setProperty('--asset-popup-bg-primary', '#ffffff');
        root.style.setProperty('--asset-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--asset-popup-text-primary', '#1e293b');
        root.style.setProperty('--asset-popup-text-secondary', '#64748b');
        root.style.setProperty('--asset-popup-border-color', '#f1f5f9');
        root.style.setProperty('--asset-popup-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--asset-card-bg-primary', '#ffffff');
        root.style.setProperty('--asset-card-bg-secondary', '#f8fafc');
        root.style.setProperty('--asset-card-text-primary', '#1e293b');
        root.style.setProperty('--asset-card-shadow', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty(
          '--asset-card-shadow-hover',
          'rgba(0, 0, 0, 0.12)',
        );
        root.style.setProperty('--asset-card-border', '#e2e8f0');
        root.style.setProperty('--asset-card-border-hover', '#cbd5e1');
        root.style.setProperty(
          '--asset-button-primary-bg',
          'rgba(59, 130, 246, 0.05)',
        );
        root.style.setProperty('--asset-button-primary-border', '#3b82f6');
        root.style.setProperty('--asset-button-primary-text', '#3b82f6');
        root.style.setProperty(
          '--asset-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty(
          '--asset-button-primary-hover-border',
          '#2563eb',
        );
        root.style.setProperty('--asset-button-primary-hover-text', '#2563eb');
        root.style.setProperty(
          '--asset-button-secondary-bg',
          'rgba(99, 102, 241, 0.05)',
        );
        root.style.setProperty('--asset-button-secondary-border', '#6366f1');
        root.style.setProperty('--asset-button-secondary-text', '#6366f1');
        root.style.setProperty(
          '--asset-button-secondary-hover-bg',
          'rgba(99, 102, 241, 0.1)',
        );
        root.style.setProperty(
          '--asset-button-secondary-hover-border',
          '#4f46e5',
        );
        root.style.setProperty(
          '--asset-button-secondary-hover-text',
          '#4f46e5',
        );
        root.style.setProperty('--asset-delete-warning-bg-primary', '#f8fafc');
        root.style.setProperty(
          '--asset-delete-warning-bg-secondary',
          '#f1f5f9',
        );
        root.style.setProperty('--asset-delete-warning-border', '#e2e8f0');
        root.style.setProperty('--asset-delete-error-bg-primary', '#fef2f2');
        root.style.setProperty('--asset-delete-error-bg-secondary', '#fee2e2');
        root.style.setProperty('--asset-delete-error-border', '#fecaca');
        root.style.setProperty('--asset-input-bg', '#ffffff');
        root.style.setProperty('--asset-input-border', '#e5e7eb');
        root.style.setProperty('--asset-input-border-hover', '#d1d5db');
        root.style.setProperty(
          '--asset-input-focus-shadow',
          'rgba(59, 130, 246, 0.1)',
        );

        // Settings Theme Variables (Blue/Indigo) - Light Mode
        root.style.setProperty('--settings-popup-bg-primary', '#ffffff');
        root.style.setProperty('--settings-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--settings-popup-text-primary', '#1e293b');
        root.style.setProperty('--settings-popup-text-secondary', '#64748b');
        root.style.setProperty('--settings-popup-border-color', '#f1f5f9');
        root.style.setProperty(
          '--settings-popup-shadow',
          'rgba(0, 0, 0, 0.15)',
        );
        root.style.setProperty('--settings-card-bg-primary', '#ffffff');
        root.style.setProperty('--settings-card-bg-secondary', '#f8fafc');
        root.style.setProperty('--settings-card-text-primary', '#1e293b');
        root.style.setProperty('--settings-card-border', '#e2e8f0');
        root.style.setProperty('--settings-card-shadow', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty(
          '--settings-button-primary-bg',
          'rgba(59, 130, 246, 0.05)',
        );
        root.style.setProperty('--settings-button-primary-border', '#3b82f6');
        root.style.setProperty('--settings-button-primary-text', '#3b82f6');
        root.style.setProperty(
          '--settings-button-primary-hover-bg',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty(
          '--settings-button-primary-hover-border',
          '#2563eb',
        );
        root.style.setProperty(
          '--settings-button-primary-hover-text',
          '#2563eb',
        );
        root.style.setProperty(
          '--settings-button-secondary-bg',
          'rgba(99, 102, 241, 0.05)',
        );
        root.style.setProperty('--settings-button-secondary-border', '#6366f1');
        root.style.setProperty('--settings-button-secondary-text', '#6366f1');
        root.style.setProperty(
          '--settings-button-secondary-hover-bg',
          'rgba(99, 102, 241, 0.1)',
        );
        root.style.setProperty(
          '--settings-button-secondary-hover-border',
          '#4f46e5',
        );
        root.style.setProperty(
          '--settings-button-secondary-hover-text',
          '#4f46e5',
        );
        root.style.setProperty('--settings-input-bg', '#ffffff');
        root.style.setProperty('--settings-input-border', '#e5e7eb');
        root.style.setProperty('--settings-input-border-hover', '#d1d5db');
        root.style.setProperty(
          '--settings-input-focus-shadow',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty('--settings-popup-input-bg', '#ffffff');
        root.style.setProperty('--settings-popup-input-border', '#e5e7eb');
        root.style.setProperty(
          '--settings-popup-input-border-hover',
          '#d1d5db',
        );
        root.style.setProperty(
          '--settings-popup-input-focus-shadow',
          'rgba(59, 130, 246, 0.1)',
        );
        root.style.setProperty('--settings-popup-button-cancel-bg', '#f8fafc');
        root.style.setProperty(
          '--settings-popup-button-cancel-bg-hover',
          '#f1f5f9',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-text',
          '#64748b',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-border',
          '#e5e7eb',
        );
        root.style.setProperty(
          '--settings-popup-button-cancel-border-hover',
          '#d1d5db',
        );
        root.style.setProperty('--settings-accent-primary', '#3b82f6');
        root.style.setProperty('--settings-accent-secondary', '#2563eb');
        root.style.setProperty('--settings-accent-tertiary', '#1d4ed8');

        // Report Theme Variables (Blue) - Light Mode
        root.style.setProperty('--report-popup-bg-primary', '#ffffff');
        root.style.setProperty('--report-popup-bg-secondary', '#f8fafc');
        root.style.setProperty('--report-popup-text-primary', '#1e293b');
        root.style.setProperty('--report-popup-text-secondary', '#64748b');
        root.style.setProperty('--report-popup-border-color', '#f1f5f9');
        root.style.setProperty('--report-popup-shadow', 'rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--report-popup-accent-primary', '#3b82f6');
        root.style.setProperty('--report-popup-accent-secondary', '#2563eb');
        root.style.setProperty('--report-popup-card-bg', '#ffffff');
        root.style.setProperty('--report-popup-card-border', '#e2e8f0');
        root.style.setProperty('--report-popup-card-hover-bg', '#f8fafc');
        root.style.setProperty('--report-popup-card-hover-border', '#3b82f6');
      }
    };

    return {
      themeClass,
      updateCSSVariables,
      isDark,
    };
  }, [theme.palette.mode]);
};
