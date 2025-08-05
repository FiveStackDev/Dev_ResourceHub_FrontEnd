import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

/**
 * Component for registering and managing the PWA service worker
 */
const PWAManager = () => {
  useEffect(() => {
    // Use the vite-plugin-pwa registerSW function with auto-update
    // Define the interval (in milliseconds) for checking for service worker updates
    const intervalMS = 60 * 60 * 1000; // Check every hour

    const updateSW = registerSW({
      onNeedRefresh() {
        // This will be handled by PWAUpdatePrompt component
        console.log('New content available, refresh needed');
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
      immediate: true,
      // Register an interval to check for updates
      registerPath: '/sw.js',
      intervalMS,
    });

    return () => {
      // No need to manually clean up as the vite-plugin-pwa handles this
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PWAManager;
