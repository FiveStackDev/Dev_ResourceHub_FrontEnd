import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useSidebar } from '../../contexts/SidebarContext';
import { useThemeContext } from '../../theme/ThemeProvider';
import { useUser } from '../../contexts/UserContext';

// Shared components
import ModeToggle from './ModeToggle';
import ThemeToggle from './ThemeToggle';
import ProfileMenu from './ProfileMenu';
import MobileMenu from './MobileMenu';
import { Link } from 'react-router-dom';

const AppHeader = ({
  title = 'Dashboard',
  logo, // Updated: Can be string (text) or image path
  notificationCount = 0,
  showSettings = true,
  showOrdersInProfile = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Changed to md for better mobile handling
  const { toggle } = useSidebar();
  const { toggleMode } = useThemeContext();
  const { userData, isAdmin, toggleAdminMode, isAdminView } = useUser();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggle}
            sx={{ mr: 2 }}
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40, // Increased size
                height: 40, // Increased size
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                mr: 1,
                fontWeight: 'bold',
                overflow: 'hidden', // Ensure image fits
              }}
            >
              {typeof logo === 'string' && logo.includes('/') ? (
                <img
                  src={logo}
                  alt={`${title} Logo`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                  }}
                >
                  {logo}
                </Box>
              )}
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Only render ModeToggle if user has Admin or SuperAdmin role */}
          {(userData.role === 'Admin' || userData.role === 'SuperAdmin') && (
            <ModeToggle
              isAdmin={isAdminView}
              toggleAdminMode={toggleAdminMode}
            />
          )}

          {!isMobile ? (
            <>
              <Link to={'/notifications'} style={{ textDecoration: 'none' }}>
                <Tooltip title="Notifications">
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{
                      bgcolor: theme.palette.background.default,
                      '&:hover': { bgcolor: theme.palette.action.hover },
                    }}
                  >
                    <Badge badgeContent={notificationCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Link>

              {showSettings && (
                <Tooltip title="Settings">
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{
                      bgcolor: theme.palette.background.default,
                      '&:hover': { bgcolor: theme.palette.action.hover },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              )}

              <ThemeToggle />
            </>
          ) : (
            <IconButton
              size="large"
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{
                bgcolor: theme.palette.background.default,
                '&:hover': { bgcolor: theme.palette.action.hover },
              }}
            >
              <MoreIcon />
            </IconButton>
          )}

          <ProfileMenu showOrdersOption={showOrdersInProfile} />
        </Box>
      </Toolbar>

      <MobileMenu
        anchorEl={mobileMoreAnchorEl}
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        toggleMode={toggleMode}
        notificationCount={notificationCount}
      />
    </AppBar>
  );
};

export default AppHeader;
