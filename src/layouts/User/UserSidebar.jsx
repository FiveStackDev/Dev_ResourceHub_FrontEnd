import React, { useState } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as MealIcon,
  Inventory2 as AssetIcon,
  Build as MaintenanceIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';
import SidebarWrapper from '../shared/SidebarWrapper';

const navItems = [
  {
    title: 'Dashboard',
    path: '/user-dashboarduser',
    icon: <DashboardIcon />,
  },
  {
    title: 'Meal',
    icon: <MealIcon />,
    submenu: [{ title: 'Meal Calendar', path: '/user-mealcalendar' }],
  },
  {
    title: 'Assets',
    icon: <AssetIcon />,
    submenu: [
      { title: 'Asset Requests', path: '/user-assetrequest' },
      { title: 'Due Assets', path: '/user-dueassets' },
    ],
  },
  {
    title: 'Services',
    icon: <MaintenanceIcon />,
    path: '/user-maintenance',
  },
];

const UserSidebar = () => {
  const theme = useTheme();
  const { isOpen } = useSidebar();
  const [openMenus, setOpenMenus] = useState({});

  const handleToggle = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const sidebarFooter = (
    <List>
      <ListItemButton component={Link} to="/organization">
        <ListItemIcon sx={{ minWidth: 40 }}>
          <BusinessIcon />
        </ListItemIcon>
        {isOpen && <ListItemText primary="Organization Details" />}
      </ListItemButton>
      <Divider sx={{ my: 1 }} />
      <ListItemButton component={Link} to="/settings">
        <ListItemIcon sx={{ minWidth: 40 }}>
          <SettingsIcon />
        </ListItemIcon>
        {isOpen && <ListItemText primary="Settings" />}
      </ListItemButton>
    </List>
  );

  return (
    <SidebarWrapper
      title="Resource Hub"
      logo="/Resource Hub Logo.png"
      footerContent={sidebarFooter}
    >
      <List component="nav">
        {navItems.map((item, idx) => (
          <React.Fragment key={item.title}>
            {item.submenu ? (
              <>
                <ListItemButton onClick={() => handleToggle(idx)}>
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  {isOpen && <ListItemText primary={item.title} />}
                  {isOpen && (openMenus[idx] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={openMenus[idx]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((sub) => (
                      <ListItemButton
                        key={sub.title}
                        component={Link}
                        to={sub.path}
                        sx={{ pl: 6 }}
                      >
                        {isOpen && <ListItemText primary={sub.title} />}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                {isOpen && <ListItemText primary={item.title} />}
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
    </SidebarWrapper>
  );
};

export default UserSidebar;
