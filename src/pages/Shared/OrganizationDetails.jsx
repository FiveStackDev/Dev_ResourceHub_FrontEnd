import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building, MapPin, Mail, Image, Info, Globe, Phone, Users, Calendar, Award } from 'lucide-react';
import { BASE_URLS } from './../../services/api/config';
import { getAuthHeader } from './../../utils/authHeader';
import { useUser, decodeToken } from './../../contexts/UserContext';
import { useThemeStyles } from './../../hooks/useThemeStyles';
import { useThemeContext } from './../../theme/ThemeProvider';
import AdminLayout from './../../layouts/Admin/AdminLayout';
import UserLayout from './../../layouts/User/UserLayout';
import styles from '../css/OrganizationDetails.module.css';

const OrganizationDetails = () => {
  // State to store organization data
  const [organizationData, setOrganizationData] = useState({
    org_name: '',
    org_logo: '',
    org_address: '',
    org_email: '',
    org_about: '',
    org_website: '',
    org_phone: '',
    org_founded: '',
  });
  
  // Loading and error states for async data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user id from context
  const { userData } = useUser();
  const { updateCSSVariables } = useThemeStyles();
  const { mode } = useThemeContext();

  // Apply theme variables when component mounts or theme changes
  React.useEffect(() => {
    updateCSSVariables();
  }, [updateCSSVariables, mode]);

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
          org_about: organization.org_about || 'We are committed to excellence and innovation in everything we do. Our organization strives to provide the best services and create value for our stakeholders.',
          org_website: organization.org_website || '',
          org_phone: organization.org_phone || '',
          org_founded: organization.org_founded || ''
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
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Building size={32} />
          </div>
          <div className={styles.headerText}>
            <h1>Organization Profile</h1>
            <p>Comprehensive view of your organization information</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Organization Identity Section */}
        <div className={styles.identitySection}>
          <div className={styles.logoSection}>
            <div className={styles.logoContainer}>
              {organizationData.org_logo ? (
                <img
                  src={organizationData.org_logo}
                  alt="Organization Logo"
                  className={styles.organizationLogo}
                  onError={(e) => { 
                    e.target.style.display = 'none'; 
                  }}
                />
              ) : (
                <div className={styles.logoPlaceholder}>
                  <Building size={64} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.organizationInfo}>
            <h2 className={styles.organizationName}>
              {organizationData.org_name || 'Organization Name'}
            </h2>
            <div className={styles.quickStats}>
              {organizationData.org_founded && (
                <div className={styles.stat}>
                  <Calendar size={16} />
                  <span>Founded {organizationData.org_founded}</span>
                </div>
              )}

              <div className={styles.stat}>
                <Award size={16} />
                <span>Verified Organization</span>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className={styles.aboutSection}>
          <div className={styles.sectionHeader}>
            <Info size={24} />
            <h3>About Us</h3>
          </div>
          <div className={styles.aboutContent}>
            <p>{organizationData.org_about}</p>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className={styles.contactGrid}>
          <div className={styles.sectionTitle}>
            <h3>Contact Information</h3>
            <p>Get in touch with us through these channels</p>
          </div>
          
          <div className={styles.contactCards}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Mail size={24} />
              </div>
              <div className={styles.contactInfo}>
                <h4>Email Address</h4>
                <p>{organizationData.org_email || 'No email available'}</p>
                <span className={styles.contactType}>Primary Contact</span>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Phone size={24} />
              </div>
              <div className={styles.contactInfo}>
                <h4>Phone Number</h4>
                <p>{organizationData.org_phone || 'No phone number available'}</p>
                <span className={styles.contactType}>Direct Line</span>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <Globe size={24} />
              </div>
              <div className={styles.contactInfo}>
                <h4>Website</h4>
                <p>{organizationData.org_website || 'No website available'}</p>
                <span className={styles.contactType}>Online Presence</span>
              </div>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <MapPin size={24} />
              </div>
              <div className={styles.contactInfo}>
                <h4>Physical Address</h4>
                <p>{organizationData.org_address || 'No address available'}</p>
                <span className={styles.contactType}>Headquarters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className={styles.additionalInfo}>
          <div className={styles.infoCard}>
            <h4>Organization Status</h4>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              Active & Verified
            </div>
          </div>
          
          <div className={styles.infoCard}>
            <h4>Last Updated</h4>
            <p>{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
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
