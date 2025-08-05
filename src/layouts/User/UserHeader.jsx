import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppHeader from '../shared/AppHeader';
import { getUnreadCount } from '../../utils/notificationApi';
import { useUser, decodeToken } from '../../contexts/UserContext';
import { getAuthHeader } from '../../utils/authHeader';
import { BASE_URLS } from '../../services/api/config';

const UserHeader = () => {
  // Get user context and decode token
  const { user } = useUser();
  const decoded = decodeToken() || {};
  const org_logo = decoded.org_logo || '/Resource_Hub.png';

  // Fetch unread notification count on mount
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    let intervalId;
    const fetchUnreadCount = async () => {
      const count = await getUnreadCount();
      setUnreadCount(count);
    };
    fetchUnreadCount();
    intervalId = setInterval(fetchUnreadCount, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AppHeader
      title="Resource Hub"
      logo={org_logo}
      notificationCount={unreadCount}
      showSettings={false}
      showOrdersInProfile={true}
    />
  );
};

export default UserHeader;
