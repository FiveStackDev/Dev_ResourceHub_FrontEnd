import { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { registerSW } from 'virtual:pwa-register';

/**
 * Component for detecting and prompting for new app updates
 */
const PWAUpdatePrompt = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateSW, setUpdateSW] = useState(null);

  useEffect(() => {
    // Register the service worker with the update callback
    const swUpdater = registerSW({
      onNeedRefresh() {
        setShowUpdatePrompt(true);
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      }
    });
    
    setUpdateSW(() => swUpdater);

    return () => {
      // No cleanup needed
    };
  }, []);

  const handleUpdate = () => {
    if (!updateSW) return;
    
    // Update to the new version
    updateSW();
    setShowUpdatePrompt(false);
  };

  const handleClose = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <Snackbar
      open={showUpdatePrompt}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="info"
        action={
          <Button 
            color="secondary" 
            size="small" 
            onClick={handleUpdate}
            startIcon={<RefreshIcon />}
          >
            Update Now
          </Button>
        }
        onClose={handleClose}
      >
        <Typography variant="body2">
          A new version is available. Update now for the latest features!
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default PWAUpdatePrompt;
