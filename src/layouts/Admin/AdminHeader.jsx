import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppHeader from '../shared/AppHeader';
import { getUnreadCount } from '../../utils/notificationApi';
import { useUser, decodeToken } from '../../contexts/UserContext';
import { getAuthHeader } from '../../utils/authHeader';
import { BASE_URLS } from '../../services/api/config';

const AdminHeader = () => {

  // Get user context and decode token
  const { user } = useUser();
  const decoded = decodeToken() || {};
  const org_logo = decoded.org_logo || '/ResourceHub.png';
  const org_id = decoded.org_id;

  // Fetch unread notification count on mount
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    const fetchUnreadCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    fetchUnreadCount();
  }, []);

  return (
    <AppHeader
      title="Resource Hub"
      logo={org_logo}
      notificationCount={unreadCount}
      showSettings={false}
      showOrdersInProfile={false}
    />
  );
};

export default AdminHeader;
