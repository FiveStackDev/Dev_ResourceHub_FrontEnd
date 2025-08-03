import React from 'react';
import { Menu, MenuItem, Badge } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../theme/ThemeProvider';
import { Link } from 'react-router-dom';

const MobileMenu = ({
  anchorEl,
  isOpen,
  onClose,
  toggleMode,
  notificationCount = 0,
}) => {
  const { mode } = useThemeContext();

  return (
    <Menu
      anchorEl={anchorEl}
      id="mobile-menu"
      keepMounted
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.16))',
          mt: 1.5,
          width: 200,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem onClick={toggleMode}>
        {mode === 'dark' ? (
          <LightIcon sx={{ mr: 2 }} />
        ) : (
          <DarkIcon sx={{ mr: 2 }} />
        )}
        {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </MenuItem>

      <MenuItem>
       <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
           <NotificationsIcon sx={{ mr: 2 }} />
        Notifications
        <Badge badgeContent={notificationCount} color="error" sx={{ ml: 2 }} />
       </Link>
      </MenuItem>

      <MenuItem>
        <Link to="/settings">
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </Link>
      </MenuItem>
    </Menu>
  );
};

export default MobileMenu;
