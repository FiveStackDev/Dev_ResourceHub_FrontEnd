import React, { useState, useEffect } from 'react';
import AppHeader from '../shared/AppHeader';
import { getUnreadCount } from '../../utils/notificationApi';
import { useUser, decodeToken } from '../../contexts/UserContext';

const AdminHeader = () => {

  // Get user context and decode token
  const { user } = useUser();
  const decoded = decodeToken() || {};
  const org_logo = decoded.org_logo || '/ResourceHub.png';
  const org_id = decoded.org_id;

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
      showOrdersInProfile={false}
    />
  );
};

export default AdminHeader;
