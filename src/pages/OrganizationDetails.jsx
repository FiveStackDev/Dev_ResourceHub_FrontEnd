import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, MapPin, Mail, Image } from 'lucide-react';
import { BASE_URLS } from '../services/api/config';
import { getAuthHeader } from '../utils/authHeader';
import { useUser, decodeToken } from '../contexts/UserContext';
import { useThemeStyles } from '../hooks/useThemeStyles';
import AdminLayout from '../layouts/Admin/AdminLayout';
import UserLayout from '../layouts/User/UserLayout';
import styles from './css/OrganizationDetails.module.css';

const OrganizationDetails = () => {
  // State to store organization data
  const [organizationData, setOrganizationData] = useState({
    org_name: '',
    org_logo: '',
    org_address: '',
    org_email: ''
  });
  
  // Loading and error states for async data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user id from context
  const { userData } = useUser();
  const { updateCSSVariables } = useThemeStyles();

  // Apply theme variables when component mounts
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables]);

  // Fallback: decode token directly if userData.id is undefined
  let userId = userData.id;
  let orgId = null;
  if (!userId) {
    const decoded = decodeToken();
    userId = decoded?.id;
    orgId = decoded?.org_id;
    console.log('OrganizationDetails fallback decoded userId:', userId, 'orgId:', orgId);
  } else {
    const decoded = decodeToken();
    orgId = decoded?.org_id;
    console.log('OrganizationDetails userId:', userId, 'orgId:', orgId);
  }

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (!userId || !orgId) {
          setError('User or Organization ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const { data } = await axios.get(
          `${BASE_URLS.orgsettings}/details/${orgId}`,
          {
            headers: {
              ...getAuthHeader(),
            },
          }
        );
        
        const [organization] = data;
        setOrganizationData({
          org_name: organization.org_name || '',
          org_logo: organization.org_logo || '',
          org_address: organization.org_address || '',
          org_email: organization.org_email || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizationData();
  }, [userId, orgId]);

  // Get user role from context
  const userRole = userData?.role;

  // Render organization details content
  const renderContent = (
    <div className={styles.orgDetailsWrapper}>
      <div className={styles['profile-section']}>
        <div className={styles.header}>
          <Building size={32} style={{ marginBottom: '16px', color: 'var(--settings-accent-primary)' }} />
          <h2>Organization Details</h2>
          <p style={{ color: 'var(--settings-popup-text-secondary)', textAlign: 'center', margin: '0 0 16px 0' }}>
            View your organization information
          </p>
          {organizationData.org_logo && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={organizationData.org_logo}
                alt="Organization Logo"
                style={{
                  maxWidth: '150px',
                  maxHeight: '150px',
                  objectFit: 'cover',
                  border: '4px solid var(--settings-accent-primary)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
                }}
                onError={(e) => { 
                  e.target.style.display = 'none'; 
                }}
              />
            </div>
          )}
        </div>

        <div className={styles['form-container']}>
          <div className={styles['form-group']}>
            <label>
              <Building size={22} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
              Organization Name
            </label>
            <input
              className={styles['form-input']}
              type="text"
              value={organizationData.org_name}
              placeholder="No organization name available"
              readOnly
              style={{ backgroundColor: 'var(--settings-background-tertiary)', cursor: 'default', opacity: 0.8 }}
            />
          </div>

          <div className={styles['form-group']}>
            <label>
              <Image size={22} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
              Organization Logo URL
            </label>
            <input
              className={styles['form-input']}
              type="url"
              value={organizationData.org_logo}
              placeholder="No logo URL available"
              readOnly
              style={{ backgroundColor: 'var(--settings-background-tertiary)', cursor: 'default', opacity: 0.8 }}
            />
          </div>

          <div className={styles['form-group']}>
            <label>
              <MapPin size={22} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
              Organization Address
            </label>
            <textarea
              className={styles['form-input']}
              value={organizationData.org_address}
              rows="4"
              placeholder="No address available"
              readOnly
              style={{ backgroundColor: 'var(--settings-background-tertiary)', cursor: 'default', resize: 'none', opacity: 0.8, minHeight: 'auto' }}
            />
          </div>

          <div className={styles['form-group']}>
            <label>
              <Mail size={22} style={{ marginRight: '8px', verticalAlign: 'middle', display: 'inline' }} />
              Organization Email
            </label>
            <input
              className={styles['form-input']}
              type="email"
              value={organizationData.org_email}
              placeholder="No email available"
              readOnly
              style={{ backgroundColor: 'var(--settings-background-tertiary)', cursor: 'default', opacity: 0.8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Show loading or error messages before rendering content
  if (loading) {
    return (
      <>
        {userRole === 'Admin' || userRole === 'SuperAdmin' ? (
          <AdminLayout>
            <div className="profile-section">
              <p className="loading">Loading organization details...</p>
            </div>
          </AdminLayout>
        ) : userRole === 'User' ? (
          <UserLayout>
            <div className="profile-section">
              <p className="loading">Loading organization details...</p>
            </div>
          </UserLayout>
        ) : (
          <div>Please log in to view this page.</div>
        )}
      </>
    );
  }

  if (error) {
    return (
      <>
        {userRole === 'Admin' || userRole === 'SuperAdmin' ? (
          <AdminLayout>
            <div className="profile-section">
              <div className="error">
                <p>Error: {error}</p>
                <a href="/login">
                  <button style={{marginTop: '1rem'}}>Go to Login</button>
                </a>
              </div>
            </div>
          </AdminLayout>
        ) : userRole === 'User' ? (
          <UserLayout>
            <div className="profile-section">
              <div className="error">
                <p>Error: {error}</p>
                <a href="/login">
                  <button style={{marginTop: '1rem'}}>Go to Login</button>
                </a>
              </div>
            </div>
          </UserLayout>
        ) : (
          <div>Please log in to view this page.</div>
        )}
      </>
    );
  }

  return (
    <>
      {userRole === 'Admin' || userRole === 'SuperAdmin' ? (
        <AdminLayout>{renderContent}</AdminLayout>
      ) : userRole === 'User' ? (
        <UserLayout>{renderContent}</UserLayout>
      ) : (
        <div>Please log in to view this page.</div>
      )}
    </>
  );
};

export default OrganizationDetails;
