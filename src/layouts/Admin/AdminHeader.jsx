import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppHeader from '../shared/AppHeader';
import { useUser, decodeToken } from '../../contexts/UserContext';
import { getAuthHeader } from '../../utils/authHeader';
import { BASE_URLS } from '../../services/api/config';

const AdminHeader = () => {
  const [formData, setFormData] = useState({ org_logo: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get user context
  const { user } = useUser();
  const userData = user || {};
  
  let userId = userData.id;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    console.log('ProfileSettings fallback decoded userId:', userId);
  } else {
    console.log('ProfileSettings userId:', userId);
  }

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        const { data } = await axios.get(
          `${BASE_URLS.orgsettings}/details/1`,
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );
        const [organization] = data;
        setFormData({
          org_logo: organization.org_logo || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <AppHeader
      title="Resource Hub" // Updated title
      logo={formData.org_logo || '/ResourceHub.png'} // Updated logo path with fallback
      notificationCount={0}
      showSettings={false}
      showOrdersInProfile={false}
    />
  );
};

export default AdminHeader;
